"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  totalAmount: number;
  approvedAmount: number;
  rejectedAmount: number;
}

export default function InvoiceChart({
  totalAmount,
  approvedAmount,
  rejectedAmount,
}: Props) {
  const data = [
  {
    name: "Total",
    amount: totalAmount,
    color: "#0B7A6E",
  },
  {
    name: "Approved",
    amount: approvedAmount,
    color: "#065f46",
  },
  {
    name: "Rejected",
    amount: rejectedAmount,
    color: "#991b1b",
  },
];

  return (
    <div className="chart-card">
      <h3>Invoice Amount Overview</h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />
<Bar
  dataKey="amount"
  radius={[8, 8, 0, 0]}
>
  {data.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={entry.color}
    />
  ))}
</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}