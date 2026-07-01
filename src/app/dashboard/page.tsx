"use client";

import "../../styles/dashboard.css";

import {
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

import SummaryCard from "../components/SummaryCard";
import InvoiceChart from "../components/barChart";
import StatusChart from "../components/piechart";
import InvoiceTrendChart from "../components/lineChart";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // Replace these with API data later


const [records, setRecords] = useState<any[]>([]);

useEffect(() => {
  const saved = localStorage.getItem("records");

  if (saved) {
    setRecords(JSON.parse(saved));
  }
}, []);

const totalInvoices = records.length;

const approvedInvoices = records.filter(
  (record) => record.status === "APPROVED"
).length;

console.log("approvedInvoices",approvedInvoices);


const rejectedInvoices = records.filter(
  (record) => record.status === "REJECTED"
).length;

console.log("rejectedInvoices",rejectedInvoices);


const getGrandTotal = (record: any) => {
  return Number(record.items?.[0]?.grandTotal || 0);
};

const totalAmount = records.reduce(
  (sum, record) => sum + getGrandTotal(record),
  0
);

console.log("totalAmount",totalAmount);


const approvedAmount = records
  .filter((record) => record.status === "APPROVED")
  .reduce((sum, record) => sum + getGrandTotal(record), 0);

console.log("approvedAmount",approvedAmount);


const rejectedAmount = records
  .filter((record) => record.status === "REJECTED")
  .reduce((sum, record) => sum + getGrandTotal(record), 0);

console.log("rejectedAmount",rejectedAmount);

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>

      <div className="card-grid">

        <SummaryCard
          title="Total Invoices"
          value={totalInvoices}
          icon={<FileText color="#0B7A6E" />}
        />

        <SummaryCard
          title="Approved"
          value={approvedInvoices}
          icon={<CheckCircle color="#0B7A6E" />}
        />

        <SummaryCard
          title="Rejected"
          value={rejectedInvoices}
          icon={<XCircle color="#0B7A6E" />}
        />

      </div>

     <div className="chart-section">
  <InvoiceChart
    totalAmount={totalAmount}
    approvedAmount={approvedAmount}
    rejectedAmount={rejectedAmount}
  />

  <StatusChart
    totalInvoices={totalInvoices}
    approvedInvoices={approvedInvoices}
    rejectedInvoices={rejectedInvoices}
  />
    <InvoiceTrendChart
    totalInvoices={totalInvoices}
    approvedInvoices={approvedInvoices}
    rejectedInvoices={rejectedInvoices}
  />
</div>

    </div>
  );
}