"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ItemsTable from "../components/ItemsTable";
import UploadDoc from "../components/UploadDoc";
import SupplierInvoiceForm from "../components/SupplierInvoice";

const emptyInvoice = {
    supplierInformation: {},
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
        const updated = [invoice, ...existing];

        localStorage.setItem("records", JSON.stringify(updated));

        router.push("/");
    }

    function handlePdfProcessed(invoiceJson: any) {
        setInvoice({
            supplierInformation: invoiceJson.supplierInformation || {},
            dealerInformation: invoiceJson.dealerInformation || {},
            items: invoiceJson.items || [],
        });
    }

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
            <SupplierInvoiceForm
                supplier={invoice.supplierInformation}
            />
            {/* <DealerForm dealer={invoice.dealerInformation} /> */}
            <ItemsTable items={invoice.items} />

            <button onClick={handleSubmit} className="submit-btn">
                Submit
            </button>
        </>
    );
}
