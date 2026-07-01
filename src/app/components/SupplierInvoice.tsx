"use client";

import "../../styles/patient-form.css";

interface SupplierData {
  name?: string;
  invoiceDate?: string;
  invoiceNumber?: string;
  dueDate?: string;
  poDate?: string;
  poNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface SupplierInvoiceFormProps {
  supplier: SupplierData;
}

export default function SupplierInvoiceForm({
  supplier,
}: SupplierInvoiceFormProps) {
  return (
    <section className="patient-card">
      <div className="patient-header">
        <h3 className="patient-title">Supplier Invoice Submission</h3>
        <div className="header-decoration"></div>
      </div>

      <div className="patient-grid">
        <Field label="Supplier Name" value={supplier.name} />
        <Field label="Invoice Date" value={supplier.invoiceDate} />
        <Field label="Invoice Number" value={supplier.invoiceNumber} />
        <Field label="Due Date" value={supplier.dueDate} />
        <Field label="PO Date" value={supplier.poDate} />
        <Field label="PO Number" value={supplier.poNumber} />
        <Field label="Phone Number" value={supplier.phone} />
        <Field label="Email" value={supplier.email} />
      </div>

      <div className="patient-full">
        <Field label="Address" value={supplier.address} />
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="patient-field">
      <label>{label}</label>
      <input value={value ?? ""} readOnly />
    </div>
  );
}