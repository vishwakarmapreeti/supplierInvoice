import "../../styles/dealer-info.css";

export default function DealerForm({ dealer }: any) {
  return (
    <section className="dealer-card">
      <div className="dealer-header">
        <h3 className="dealer-title">Dealer Information</h3>
        <div className="header-decoration"></div>
      </div>

      <div className="dealer-grid">
        <Field label="Name" value={dealer.name} />
        <Field label="Phone" value={dealer.phone} />
        <Field label="Email" value={dealer.email} />
        <Field label="GSTIN" value={dealer.gstin} />
        <Field label="Address" value={dealer.address} />
        <Field label="Grand Total" value={dealer.grandTotal} />
        
      </div>

      <div className="dealer-full">
      </div>
    </section>
  );
}

function Field({ label, value }: any) {
  return (
    <div className="dealer-field">
      <label>{label}</label>
      <input value={value} readOnly />
    </div>
  );
}
