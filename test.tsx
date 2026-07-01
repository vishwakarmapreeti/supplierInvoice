import { NextResponse } from "next/server";
import { invoiceData } from "@/lib/invoiceData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: invoiceData,
  });
}
