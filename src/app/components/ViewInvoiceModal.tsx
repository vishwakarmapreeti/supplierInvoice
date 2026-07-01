"use client";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../../styles/view-invoice-modal.css";
import { useState } from "react";

export default function ViewInvoiceModal({
    show,
    onClose,
    invoice,
    onStatusChange,
}: any) {
    const [isApproving, setIsApproving] = useState(false);
    const status = invoice?.status || "PENDING";
    const isCompleted = status === "APPROVED" || status === "REJECTED";
    if (!invoice) return null;

    const {
        supplierInformation: supplier = {},
        items = [],
    } = invoice;

    const parseAmount = (value: any) => {
        if (value == null) return 0;

        return Number(
            String(value)
                .replace(/\$/g, "")
                .replace(/,/g, "")
                .trim()
        );
    };

    const total = items.reduce((sum: number, item: any) => {
        const rowTotal =
            parseAmount(item.total) ||
            parseAmount(item.qty) * parseAmount(item.rate);

        return sum + rowTotal;
    }, 0);

    const extractedVat =
        items.length > 0 ? parseAmount(items[0].vat) : 0;

    const hasVat =
        items.length > 0 &&
        items[0].vat !== null &&
        items[0].vat !== undefined &&
        items[0].vat !== "";

    const invoiceGrandTotal =
        items.length > 0
            ? parseAmount(items[0].grandTotal)
            : total;

    const handleApprove = async () => {
        try {
            setIsApproving(true);

            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(invoice),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to send email");
                return;
            }

            // Show success message
            alert("Email sent successfully!");

            // Update status
            await onStatusChange("APPROVED");

        } catch (err) {
            console.error(err);
            alert("Failed to send email");
        } finally {
            setIsApproving(false);
        }
    };
    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>Invoice Details</Modal.Title>
            </Modal.Header>

            <Modal.Body className="modal-body-custom modal-scroll-body">

                {/* Supplier Information */}
                <h5 className="section-title">Supplier Information</h5>

                <p><b>Name:</b> {supplier.name}</p>
                <p><b>Invoice Date:</b> {supplier.invoiceDate}</p>
                <p><b>Invoice Number:</b> {supplier.invoiceNumber}</p>
                <p><b>Due Date:</b> {supplier.dueDate}</p>
                <p><b>PO Date:</b> {supplier.poDate}</p>
                <p><b>PO Number:</b> {supplier.poNumber}</p>
                <p><b>Phone:</b> {supplier.phone}</p>
                <p><b>Email:</b> {supplier.email}</p>
                <p><b>Address:</b> {supplier.address}</p>

                {/* Items */}
                <h5 className="section-title">Items</h5>

                <div className="items-scroll">
                    <table className="table table-bordered items-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{item.sku}</td>
                                    <td>{item.description}</td>
                                    <td>{item.qty}</td>
                                    <td>${Number(item.rate).toFixed(2)}</td>
                                    <td>${Number(item.total).toFixed(2)}</td>
                                </tr>
                            ))}

                            <tr>
                                <td colSpan={3}></td>
                                <td><strong>Total</strong></td>
                                <td><strong>${total.toFixed(2)}</strong></td>
                            </tr>

                            <tr>
                                <td colSpan={3}></td>
                                <td><strong>VAT (5%)</strong></td>
                                <td>
                                    <strong>
                                        {hasVat ? `$${extractedVat.toFixed(2)}` : ""}
                                    </strong>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={3}></td>
                                <td><strong>Grand Total</strong></td>
                                <td>
                                    <strong>
                                        {invoiceGrandTotal
                                            ? `$${invoiceGrandTotal.toFixed(2)}`
                                            : ""}
                                    </strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </Modal.Body>

            <Modal.Footer className="modal-footer-custom">
                <div className="me-auto">
                    <strong>Status: </strong>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                        {status}
                    </span>
                </div>

                {!isCompleted && (
                    <>
                        <Button
                            variant="success"
                            onClick={handleApprove}
                            disabled={isApproving}
                        >
                            {isApproving ? "Approving..." : "Approve"}
                        </Button>

                        <Button
                            variant="danger"
                            onClick={() => onStatusChange("REJECTED")}
                        >
                            Reject
                        </Button>
                    </>
                )}

                <Button className="close-btn" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}