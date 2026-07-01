import "../../styles/items-table.css";

export default function ItemsTable({ items = [] }: any) {

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

  const vat = hasVat ? extractedVat : null;

  const invoiceGrandTotal =
    items.length > 0 ? parseAmount(items[0].grandTotal) : total;
  return (
    <section className="items-card">
      <h3 className="items-title">Items</h3>

      <table className="items-table">
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
          {items.map((item: any, index: number) => {
            const rowTotal =
              parseAmount(item.total) ||
              parseAmount(item.qty) * parseAmount(item.rate);
            return (
              <tr key={index}>
                <td>{item.sku}</td>
                <td>{item.description}</td>
                <td>{item.qty}</td>
                <td>{parseAmount(item.rate).toFixed(2)}</td>
                <td>{rowTotal.toFixed(2)}</td>
              </tr>
            );
          })}

          <tr className="summary-row">
            <td colSpan={3}></td>
            <td><strong>Total</strong></td>
            <td><strong>{total.toFixed(2)}</strong></td>
          </tr>

          <tr className="summary-row">
            <td colSpan={3}></td>
            <td><strong>VAT (5%)</strong></td>
            <td>
              <strong>{vat !== null ? vat.toFixed(2) : ""}</strong>
            </td>
          </tr>

          <tr className="summary-row">
            <td colSpan={3}></td>
            <td><strong>Grand Total</strong></td>
            <td>
              <strong>
                {invoiceGrandTotal
                  ? invoiceGrandTotal.toFixed(2)
                  : ""}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}