"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

type Props = {
    totalInvoices: number;
    approvedInvoices: number;
    rejectedInvoices: number;
};

export default function InvoiceTrendChart({

}: Props) {
    const data = [
        { month: "Jan", total: 25, approved: 20, rejected: 5 },
        { month: "Feb", total: 35, approved: 28, rejected: 7 },
        { month: "Mar", total: 42, approved: 35, rejected: 7 },
        { month: "Apr", total: 55, approved: 48, rejected: 7 },
        { month: "May", total: 63, approved: 54, rejected: 9 },
        { month: "Jun", total: 74, approved: 65, rejected: 9 },
        { month: "Jul", total: 90, approved: 78, rejected: 12 },
    ];

    return (
        <div className="chart-card">
            <h3>Invoice Trend</h3>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />
                    <YAxis />

                    <Tooltip />

                    <Line dataKey="total" stroke="#0B7A6E" strokeWidth={3} />
                    <Line dataKey="approved" stroke="#065f46" strokeWidth={3} />
                    <Line dataKey="rejected" stroke="#991b1b" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}