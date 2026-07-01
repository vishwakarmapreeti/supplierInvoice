import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import ExcelJS from "exceljs";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const workbook = new ExcelJS.Workbook();


        const supplierSheet = workbook.addWorksheet("Supplier");

        supplierSheet.columns = [
            { header: "Name", key: "name", width: 30 },
            { header: "Invoice No", key: "invoiceNumber", width: 20 },
            { header: "Invoice Date", key: "invoiceDate", width: 18 },
            { header: "Due Date", key: "dueDate", width: 18 },
            { header: "PO Number", key: "poNumber", width: 18 },
            { header: "Phone", key: "phone", width: 20 },
            { header: "Email", key: "email", width: 30 },
            { header: "Address", key: "address", width: 50 },
        ];

        supplierSheet.addRow({
            name: body.supplierInformation?.name,
            invoiceNumber: body.supplierInformation?.invoiceNumber,
            invoiceDate: body.supplierInformation?.invoiceDate,
            dueDate: body.supplierInformation?.dueDate,
            poNumber: body.supplierInformation?.poNumber,
            phone: body.supplierInformation?.phone,
            email: body.supplierInformation?.email,
            address: body.supplierInformation?.address,
        });

        const buffer = await workbook.xlsx.writeBuffer();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: "preetivishwakarma900@gmail.com",
            subject: "Supplier Invoice",
            text: "Please find the attached supplier invoice.",
            attachments: [
                {
                    filename: "SupplierInvoice.xlsx",
                    content: Buffer.from(buffer),
                },
            ],
        });
        console.log(info);
        console.log("Email sent:", info.messageId);
        console.log("Message ID:", info.messageId);
        console.log("Accepted:", info.accepted);
        console.log("Rejected:", info.rejected);

        return NextResponse.json({
            success: true,
            message: "Email sent successfully.",
        });
    } catch (error) {
        console.error("Email Error:", error);

        return NextResponse.json(
            {
                success: false,
                error: String(error),
            },
            { status: 500 }
        );
    }
}