"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Camera,
  X,
  Loader2,
  ScanLine,
  ImageIcon,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { fileToBase64 } from "@/lib/utils";
import { ScanResult } from "@/types/expense";
import ScanResultView from "./scan-result-view";
import Image from "next/image";

type ScanStep = "upload" | "preview" | "scanning" | "invalid" | "result";

export default function ReceiptScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<ScanStep>("upload");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [invalidMessage, setInvalidMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const steps = [
    { key: "upload", label: "Upload" },
    { key: "preview", label: "Preview" },
    { key: "scanning", label: "Scan" },
    { key: "result", label: "Review" },
  ];

  const currentStepIndex =
    step === "invalid"
      ? 2
      : steps.findIndex((s) => s.key === step);

  const handleFile = useCallback(async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WebP, or HEIC)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    setSelectedFile(file);
    setScanResult(null);
    setInvalidMessage("");

    const url = URL.createObjectURL(file);
    setPreview(url);
    setStep("preview");

    const base64 = await fileToBase64(file);
    setImageBase64(base64);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  }, []);

  const handleScan = async () => {
    if (!imageBase64 || !selectedFile) return;

    setStep("scanning");
    try {
      const response = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          mimeType: selectedFile.type,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Check if it's an invalid document type
        if (result.isValidDocument === false) {
          setInvalidMessage(result.error);
          setStep("invalid");
          return;
        }
        throw new Error(result.error || "Scan failed");
      }

      setScanResult(result.data);
      setStep("result");
      toast.success("Receipt scanned successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to scan receipt"
      );
      setStep("preview");
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setScanResult(null);
    setImageBase64(null);
    setInvalidMessage("");
    setStep("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSaved = () => {
    handleClear();
    toast.success("Expense saved!");
  };

  return (
    <div className="space-y-6 lg:w-1/2">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-1">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-1">
            <div
              className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-all duration-300 ${step === "invalid" && i === 2
                ? "bg-red-600 text-white shadow-md shadow-red-200"
                : i < currentStepIndex
                  ? "bg-green-50 text-green-600"
                  : i === currentStepIndex
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-slate-100 text-slate-400"
                }`}
            >
              {step === "invalid" && i === 2 ? (
                <AlertTriangle className="h-3 w-3" />
              ) : i < currentStepIndex ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
                  {i + 1}
                </span>
              )}
              <span className="hidden sm:inline">
                {step === "invalid" && i === 2 ? "Invalid" : s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight
                className={`h-3 w-3 ${i < currentStepIndex ? "text-green-300" : "text-slate-200"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-200 ${dragActive
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/50"
            }`}
        >
          <div
            className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${dragActive ? "bg-blue-100" : "bg-slate-100 group-hover:bg-blue-50"
              }`}
          >
            <ImageIcon
              className={`h-7 w-7 transition-colors ${dragActive
                ? "text-blue-600"
                : "text-slate-400 group-hover:text-blue-500"
                }`}
            />
          </div>
          <p className="mb-1 text-base font-semibold text-slate-800">
            Drop your receipt here
          </p>
          <p className="mb-6 text-sm text-slate-400">
            Supports JPEG, PNG, WebP • Max 10MB
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98] sm:hidden"
            >
              <Camera className="h-4 w-4" />
              Take Photo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && preview && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-slate-50">
            <Image
              width={500}
              height={500}
              src={preview}
              alt="Receipt preview"
              className="mx-auto max-h-[420px] object-contain p-4"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-700">
                {selectedFile?.name}
              </p>
              <p className="text-xs text-slate-400">
                {(selectedFile!.size / 1024).toFixed(0)} KB •{" "}
                {selectedFile?.type.split("/")[1].toUpperCase()}
              </p>
            </div>
            <button
              type="button"
              onClick={handleScan}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
            >
              <ScanLine className="h-4 w-4" />
              Scan Receipt
            </button>
          </div>
        </div>
      )}

      {/* Step: Scanning Animation */}
      {step === "scanning" && preview && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-slate-50">
            <Image
              width={500}
              height={500}
              src={preview}
              alt="Scanning receipt"
              className="mx-auto max-h-[420px] object-contain p-4 opacity-60"
            />

            <div className="absolute inset-x-4 top-4 bottom-4 overflow-hidden rounded-lg">
              <div className="animate-scan absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_3px_rgba(59,130,246,0.4)]" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px]">
              <div className="flex flex-col items-center rounded-2xl bg-white/90 px-8 py-6 shadow-lg backdrop-blur-sm">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm font-semibold text-slate-800">
                  Analyzing image...
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Verifying document &amp; extracting details
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step: Invalid Document */}
      {step === "invalid" && preview && (
        <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
          <div className="relative bg-slate-50">
            <Image
              width={500}
              height={500}
              src={preview}
              alt="Invalid document"
              className="mx-auto max-h-[300px] object-contain p-4 opacity-40 grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center rounded-2xl bg-white/95 px-8 py-6 shadow-lg backdrop-blur-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Not a Valid Document
                </p>
                <p className="mt-1.5 max-w-xs text-center text-xs text-slate-500">
                  {invalidMessage}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-red-100 bg-red-50/50 px-5 py-4">
            <p className="text-xs text-red-600">
              Please upload a receipt or invoice image
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Step: Results */}
      {step === "result" && scanResult && (
        <ScanResultView
          result={scanResult}
          imagePreview={preview}
          onClear={handleClear}
          onSaved={handleSaved}
        />
      )}

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0%;
          }
        }
        :global(.animate-scan) {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}