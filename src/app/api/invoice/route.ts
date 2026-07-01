import { NextResponse } from "next/server";
import DocumentIntelligence, {
    getLongRunningPoller,
    isUnexpected,
} from "@azure-rest/ai-document-intelligence";



import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { AzureOpenAI } from "openai";

/* =======================
   ENV VARIABLES
======================= */
const DI_KEY = process.env.KEY1!;
const DI_ENDPOINT = process.env.ENDPOINT1!;

const OPENAI_API_KEY = process.env.APIKEY2!;
const OPENAI_ENDPOINT = process.env.ENDPOINT2!;
const OPENAI_API_VERSION = "2024-12-01-preview";
const OPENAI_DEPLOYMENT = "gpt-5.4-mini";

/* =======================
   OPENAI CLIENT
======================= */
const openai = new AzureOpenAI({
    apiKey: OPENAI_API_KEY,
    endpoint: OPENAI_ENDPOINT,
    apiVersion: OPENAI_API_VERSION,
    deployment: OPENAI_DEPLOYMENT,
});

/* =======================
   DOCUMENT INTELLIGENCE
======================= */
async function documentProcessing(filePath: string): Promise<string> {
    const fileBuffer = fs.readFileSync(filePath);

    const diClient = DocumentIntelligence(DI_ENDPOINT, {
        key: DI_KEY,
    });

    const initialResponse = await diClient
        .path("/documentModels/{modelId}:analyze", "prebuilt-layout")
        .post({
            contentType: "application/pdf",
            body: fileBuffer,
        });

    if (isUnexpected(initialResponse)) {
        throw new Error(initialResponse.body.error.message);
    }

    const poller = getLongRunningPoller(diClient, initialResponse);
    const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

    return analyzeResult.content;
}


const jsonDir = path.join(process.cwd(), "generated-json");
if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir)
}


/* =======================
   GENAI PROCESSING
======================= */
async function genAIProcessing(inputText: string): Promise<any> {
const PROMPT = `
Extract the invoice into the following JSON.

IMPORTANT:

The invoice header contains the supplier/company information.

Extract the following fields ONLY from the invoice header:

- name
- address
- phone
- email

Do NOT extract these fields from the Buyer, Bill To, Ship To, Sold To, Customer, or Recipient sections.

For the following invoice fields:

- invoiceNumber
- invoiceDate
- dueDate
- poNumber
- poDate

Extract them from the invoice details wherever they appear on the invoice.

If any of these values are missing, return null.

Do NOT infer or generate missing values.

If the invoice does not contain VAT or Tax, return null.

Do NOT calculate VAT yourself.

Rules:
- Return ONLY valid JSON.
- Use null when a value is missing.
- Do NOT infer missing values.
- Preserve dates exactly as written.
- Return all monetary values as NUMBERS only.
- Remove currency symbols ($, ₹, etc.).
- Remove commas from numbers.
- Do NOT return monetary values as strings.

Examples:
"$44.10" → 44.10
"$1,764.00" → 1764
"$13,021.82" → 13021.82

Return this JSON exactly:

{
  "supplierInformation": {
    "name": null,
    "address": null,
    "phone": null,
    "email": null,
    "invoiceNumber": null,
    "invoiceDate": null,
    "dueDate": null,
    "poNumber": null,
    "poDate": null
  },
  "items": [
    {
      "sku": null,
      "description": null,
      "qty": null,
      "rate": null,
      "vat:null
      "total": null,
      "grandTotal": null
    }
  ]
}

Definitions:
- qty = quantity
- rate = unit price.
- total = qty x rate for that item.
- grandTotal = the OVERALL invoice grand total (repeat the same invoice grand total value in every item).

Invoice text:
${inputText}
`;

    const response = await openai.chat.completions.create({
        model: OPENAI_DEPLOYMENT,
        temperature: 0,
        max_completion_tokens: 16384,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: PROMPT }],
    });

    const result = response.choices?.[0]?.message?.content;

    if (!result) {
        throw new Error("OpenAI returned empty content.");
    }

    const invoiceJson = JSON.parse(result);

    return invoiceJson;
    // return JSON.parse(result);
}

/* =======================
   POST API
======================= */
export async function POST(req: Request) {
    try {
        console.log("📥 POST /api/invoice called");

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.error("❌ No file received");
            return NextResponse.json({ error: "No file" }, { status: 400 });
        }

        console.log("📄 File received:", file.name, file.size);

        const buffer = Buffer.from(await file.arrayBuffer());

        const tempDir = path.join(process.cwd(), "tmp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const filePath = path.join(tempDir, `${randomUUID()}.pdf`);
        fs.writeFileSync(filePath, buffer);

        console.log("📂 File saved to:", filePath);

        console.log("🔍 Running Document Intelligence...");
        const extractedText = await documentProcessing(filePath);

        console.log("🧠 Running OpenAI...");
        const invoiceJson = await genAIProcessing(extractedText);

        // unique file name 
        const jsonFilePath = path.join(
            jsonDir,
            `invoice-${randomUUID()}.json`
        )
        fs.writeFileSync(
            jsonFilePath,
            JSON.stringify(invoiceJson, null, 2), // pretty format
            "utf-8"
        );

        console.log("📝 JSON saved to:", jsonFilePath);

        // 👀 CHECK JSON HERE
        console.log("🟢 FINAL INVOICE JSON:");
        console.dir(invoiceJson, { depth: null, color: true });

        fs.unlinkSync(filePath);

        console.log("✅ Processing complete");

        return NextResponse.json({
            success: true,
            data: invoiceJson,
        });


    } catch (error: any) {
        console.error("🔥 API ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Internal error" },
            { status: 500 }
        );
    }
}
