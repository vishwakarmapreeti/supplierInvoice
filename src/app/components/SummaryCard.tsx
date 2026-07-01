interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export default function SummaryCard({
  title,
  value,
  icon,
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className="card-icon">{icon}</div>

      <div>
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
}