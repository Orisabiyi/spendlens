"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Camera,
  X,
  Loader2,
  ScanLine,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { fileToBase64 } from "@/lib/utils";
import { ScanResult } from "@/types/expense";
import ScanResultView from "./scan-result-view";
import Image from "next/image";

export default function ReceiptScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

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

    const url = URL.createObjectURL(file);
    setPreview(url);

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

    setScanning(true);
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
        throw new Error(result.error || "Scan failed");
      }

      setScanResult(result.data);
      toast.success("Receipt scanned successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to scan receipt"
      );
    } finally {
      setScanning(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setScanResult(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSaved = () => {
    handleClear();
    toast.success("Expense saved!");
  };

  return (
    <div className="space-y-6 w-1/2">
      {/* Upload Area */}
      {!preview && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-white hover:border-slate-400"
            }`}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <ImageIcon className="h-6 w-6 text-slate-500" />
          </div>
          <p className="mb-1 text-base font-medium text-slate-700">
            Drop your receipt here
          </p>
          <p className="mb-5 text-sm text-slate-400">
            or use the buttons below
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
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

      {/* Image Preview + Actions */}
      {preview && !scanResult && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative">
            <Image
              width={500}
              height={500}
              src={preview}
              alt="Receipt preview"
              className="max-h-[400px] w-full object-contain bg-slate-50"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 p-4">
            <div className="text-sm text-slate-500">
              {selectedFile?.name} •{" "}
              {(selectedFile!.size / 1024).toFixed(0)} KB
            </div>
            <button
              type="button"
              onClick={handleScan}
              disabled={scanning}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {scanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <ScanLine className="h-4 w-4" />
                  Scan Receipt
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scanResult && (
        <ScanResultView
          result={scanResult}
          imagePreview={preview}
          onClear={handleClear}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}