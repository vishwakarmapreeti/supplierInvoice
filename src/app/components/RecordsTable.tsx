import { useState, useMemo, useRef } from "react";
import { Search, Trash2, Eye, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import "../../styles/records-table.css";
import { useRouter } from "next/navigation";


export default function RecordsList({
  records,
  onDelete,
  onView,
  onUploadDoc,
}: {
  records: any[];
  onDelete: (index: number) => void;
  onView: (record: any) => void;
  onUploadDoc?: (file: File) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 10;

  const router = useRouter();

  // console.log("😊😊records:", records);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchLower = searchTerm.toLowerCase();
      const vendorName = record.supplierInformation?.name || "";
      const phone =
        record.supplierInformation?.phone ||
        record.supplierInformation?.phoneNumber ||
        "";
      const email = record.supplierInformation?.email || "";
      const invoiceNo = record.supplierInformation?.invoiceNumber || "";
      return (
        vendorName.toLowerCase().includes(searchLower) ||
        phone.includes(searchLower) ||
        email.toLowerCase().includes(searchLower) ||
        invoiceNo.toLowerCase().includes(searchLower)
      );
    });
  }, [records, searchTerm]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getOriginalIndex = (displayIndex: number) => {
    return records.findIndex(
      (record) =>
        record.supplierInformation?.invoiceNumber ===
        currentRecords[displayIndex].supplierInformation?.invoiceNumber
    );
  };

  return (
    <div className="records-container">
      <div className="records-header">
        <div className="header-top">
          <h3 className="records-title">
            Records <span className="record-count">{filteredRecords.length}</span>
          </h3>
          <button
            className="btn-upload-doc"
            onClick={() => router.push("/supplierPortal")}
            title="Upload Document"
          >
            <Plus size={20} />
            Upload Doc
          </button>

        </div>

        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or invoice..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="records-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Vendor Name</th>
              <th>Invoice Number</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Invoice Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.length === 0 && (
              <tr className="empty-row">
                <td colSpan={8}>
                  <div className="empty-state">
                    {records.length === 0 ? "No records yet" : "No results found"}
                  </div>
                </td>
              </tr>
            )}

            {currentRecords.map((record, displayIndex) => {
              const originalIndex = getOriginalIndex(displayIndex);
              return (
                <tr key={displayIndex} className="table-row">
                  <td className="cell-number">{startIndex + displayIndex + 1}</td>

                  <td className="cell-name">
                    {record.supplierInformation?.name || "-"}
                  </td>

                  <td className="cell-invoice">
                    {record.supplierInformation?.invoiceNumber || "-"}
                  </td>

                  <td className="cell-phone">
                    {record.supplierInformation?.phone || record.supplierInformation?.phoneNumber || "-"}
                  </td>

                  <td className="cell-email">
                    {record.supplierInformation?.email || "-"}
                  </td>

                  <td className="cell-date">
                    {record.supplierInformation?.invoiceDate || "-"}
                  </td>


                  <td>
                    <span className={`status-badge ${(record.status || "PENDING").toLowerCase()}`}>
                      {record.status || "PENDING"}
                    </span>
                  </td>

                  <td className="cell-actions">
                    <button
                      className="btn-view"
                      onClick={() => onView(record)}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(originalIndex)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>


                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="pagination-info">
            <span className="page-input">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value) || 1;
                  handlePageChange(page);
                }}
                className="page-number-input"
              />
              <span className="page-separator">/</span>
              <span className="total-pages">{totalPages}</span>
            </span>
            <span className="records-info">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of{" "}
              {filteredRecords.length}
            </span>
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
