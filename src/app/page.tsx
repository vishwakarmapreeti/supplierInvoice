"use client";

import { useEffect, useState } from "react";
import RecordsTable from "./components/RecordsTable";
import ViewInvoiceModal from "./components/ViewInvoiceModal";
import "../styles/page1.css"
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InvoiceListPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [highlightInvoiceNo, setHighlightInvoiceNo] = useState<string | null>(null);
  const router = useRouter();

  // Load records when page loads
  useEffect(() => {
    const saved = localStorage.getItem("records");
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  function handleView(record: any) {
    setSelectedInvoice(record);
    setShowModal(true);
  }


  useEffect(() => {
    const saved = localStorage.getItem("records");
    if (saved) {
      setRecords(JSON.parse(saved));
    }

    const highlight = localStorage.getItem("highlightInvoiceNo");
    if (highlight) {
      setHighlightInvoiceNo(highlight);

      setTimeout(() => {
        setHighlightInvoiceNo(null);
        localStorage.removeItem("highlightInvoiceNo");
      }, 3000);
    }
  }, []);


  function handleDelete(index: number) {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
  }

  const handleStatusChange = (newStatus: string) => {
    const updatedRecords = records.map((record) =>
      record.supplierInformation?.invoiceNumber ===
        selectedInvoice?.supplierInformation?.invoiceNumber
        ? { ...record, status: newStatus }
        : record
    );

    setRecords(updatedRecords);
    localStorage.setItem("records", JSON.stringify(updatedRecords));

    setSelectedInvoice({
      ...selectedInvoice,
      status: newStatus,
    });

    setShowModal(false);
  };

  return (
    <>
      <div className="invoice-list-header">
        <h2>Invoice List</h2>
      </div>

      <RecordsTable
        records={records}
        onView={handleView}
        onDelete={handleDelete}
      />

      <ViewInvoiceModal
        show={showModal}
        onClose={() => setShowModal(false)}
        invoice={selectedInvoice}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
