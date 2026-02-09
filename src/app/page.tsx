import Navbar from "@/components/navbar";
import ReceiptScanner from "@/components/receipt-scanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <header className="px-4 py-8 bg-white/80 h-screen flex flex-col items-center justify-center">
        <div className="mb-6 w-1/2">
          <h1 className="text-2xl font-bold text-slate-900">Scan Receipt</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload a receipt image and let AI extract the details
          </p>
        </div>

        <ReceiptScanner />
      </header>
    </>
  );
}