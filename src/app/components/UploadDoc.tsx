"use client";

import { useRef } from "react";
import "../../styles/upload-doc.css"

interface UploadDocProps {
  onPdfProcessed: (invoiceJson: any) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  uploadError: string;
  setUploadError: (v: string) => void;
  previewText: string;
  setPreviewText: (v: string) => void;
}


export default function UploadDoc({
  onPdfProcessed,
  isProcessing,
  setIsProcessing,
  uploadError,
  setUploadError,
  previewText,
  setPreviewText,
}: UploadDocProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ PUT YOUR FUNCTION HERE
  const handlePdfUpload = async (file: File) => {
    if (!file) return;

    setUploadError("");
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/invoice", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to process document");
      }

      const json = await res.json();

      // 🔥 Send JSON to parent
      onPdfProcessed(json.data);

    } catch {
      setUploadError("Failed to process PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
<section className="card">
  <h2>Upload Document</h2>

  <div
    className={`upload-area ${isProcessing ? "loading" : ""}`}
    onClick={() => !isProcessing && fileInputRef.current?.click()}
  >
    {isProcessing ? (
      <div className="processing">
        <div className="spinner" />
        <p>Processing document…</p>
        <small>Please wait, this may take 10–20 seconds</small>
      </div>
    ) : (
      <>
        Click or Drag PDF
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="application/pdf"
          onChange={(e) =>
            e.target.files && handlePdfUpload(e.target.files[0])
          }
        />
      </>
    )}
  </div>

  {uploadError && <p className="error">{uploadError}</p>}
</section>

  );
}
