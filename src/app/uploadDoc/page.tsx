"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PatientForm from "../components/PatientForm";
import DealerForm from "../components/Dealerform";
import ItemsTable from "../components/ItemsTable";
import UploadDoc from "../components/UploadDoc";

const emptyInvoice = {
  patientInformation: {},
  dealerInformation: {},
  items: [],
};

export default function UploadDocPage() {
  const [invoice, setInvoice] = useState(emptyInvoice);
  const [isProcessing, setIsProcessing] = useState(false);
const [uploadError, setUploadError] = useState("");
const [previewText, setPreviewText] = useState("");

  const router = useRouter();

  function handleSubmit() {
    const existing = JSON.parse(localStorage.getItem("records") || "[]");
  // NEW record comes FIRST
  const updated = [invoice, ...existing];

    localStorage.setItem("records", JSON.stringify(updated));

    // Navigate to Invoice List
    router.push("/");
  }

function handlePdfProcessed(invoiceJson: any) {
  setInvoice({
    patientInformation: invoiceJson.patientInformation || {},
    dealerInformation: invoiceJson.dealerInformation || {},
    items: invoiceJson.items || [],
  });
}




    /* RUN button fills data */
//   async function handleRun() {
//     const res = await fetch("/api/invoice");
//     const json = await res.json();

//     setInvoice(json.data);
//   }

  return (
    <>
 <UploadDoc
      onPdfProcessed={handlePdfProcessed}
      isProcessing={isProcessing}
      setIsProcessing={setIsProcessing}
      uploadError={uploadError}
      setUploadError={setUploadError}
      previewText={previewText}
      setPreviewText={setPreviewText}
    />

      {/* <button onClick={handleRun} className="run-btn">
        RUN AI
      </button> */}
      <PatientForm patient={invoice.patientInformation} />
      <DealerForm dealer={invoice.dealerInformation} />
      <ItemsTable items={invoice.items} />

      <button onClick={handleSubmit} className="submit-btn">
        SUBMIT
      </button>
    </>
  );
}
