"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

type Props = {
    totalInvoices: number;
    approvedInvoices: number;
    rejectedInvoices: number;
};

export default function StatusChart({
    approvedInvoices,
    rejectedInvoices,
    totalInvoices,
}: Props) {
    const data = [
        {
            name: "Total",
            value: totalInvoices,
            color: "#0B7A6E",
        },

        {
            name: "Approved",
            value: approvedInvoices,
            color: "#065f46",
        },
        {
            name: "Rejected",
            value: rejectedInvoices,
            color: "#991b1b",
        },
    ];

    return (
        <div className="chart-card">
            <h3>Invoice Status</h3>

            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.color}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}   