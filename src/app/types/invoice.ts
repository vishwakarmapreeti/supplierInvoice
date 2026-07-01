export interface DealerInformation {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  drugLicense: string;
  grandTotal:number;
}

export interface PatientInformation {
  patientName: string;
  ppfNo: string;
  mjpjayNo: string;
  hospital: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
}

export interface InvoiceItem {
  sn: number;
  hsn: string;
  productName: string;
  pack: number;
  qty: number;
  batch: string;
  mfg: string;
  mrp: number;
  exp:string;
  rate: number;
  dis:number;
  sgst: number;
  cgst: number;
  total: number;
}

export interface InvoiceResponse {
  dealerInformation: DealerInformation;
  patientInformation: PatientInformation;
  items: InvoiceItem[];
//   summary: {
//     totalItems: number;
//     totalQty: number;
//     taxableAmount: number;
//     sgst: number;
//     cgst: number;
//     grandTotal: number;
//   };
}
