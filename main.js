import DocumentIntelligence, {
  getLongRunningPoller,
  isUnexpected,
} from "@azure-rest/ai-document-intelligence";
import fs from "fs";
import "dotenv/config";
import { AzureOpenAI } from "openai";

/* =======================
   ENV VARIABLES
======================= */
const DI_KEY = process.env.KEY1;
const DI_ENDPOINT = process.env.ENDPOINT1;

const OPENAI_API_KEY = process.env.APIKEY2;
const OPENAI_ENDPOINT = process.env.ENDPOINT2;

const OPENAI_API_VERSION = "2024-04-01-preview";
const OPENAI_DEPLOYMENT = "gpt-4o";

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
async function documentProcessing(filePath) {
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
    throw initialResponse.body.error;
  }

  const poller = getLongRunningPoller(diClient, initialResponse);
  const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

  return analyzeResult.content;
}

/* =======================
   GENAI PROCESSING
======================= */
async function genAIProcessing(inputText) {
  const PROMPT = `
Extract pharmacy invoice data from the text below and return JSON
matching this structure exactly. Use null if data is missing.
Return ONLY valid JSON.

{
  "dealerInformation": {
    "name": string | null,
    "address": string | null,
    "phone": string | null,
    "email": string | null,
    "gstin": string | null,
    "drugLicense": string | null
  },
  "patientInformation": {
    "patientName": string | null,
    "ppfNo": string | null,
    "mjpjayNo": string | null,
    "hospital": string | null,
    "invoiceNo": string | null,
    "invoiceDate": string | null,
    "dueDate": string | null
  },
  "items": [
    {
      "sn": number | null,
      "hsn": string | null,
      "productName": string | null,
      "pack": number | null,
      "qty": number | null,
      "batch": string | null,
      "mfg": string | null,
      "mrp": number | null,
      "rate": number | null,
      "sgst": number | null,
      "cgst": number | null,
      "total": number | null
    }
  ]
}

Invoice text:
${inputText}
`;

  const response = await openai.chat.completions.create({
    model: OPENAI_DEPLOYMENT,
    temperature: 0,
    max_tokens: 800,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: PROMPT }],
  });

  const result = response.choices[0].message.content;
  return JSON.parse(result);
}

/* =======================
   RUN
======================= */
const extractedText = await documentProcessing("./sample.pdf");
const invoiceJson = await genAIProcessing(extractedText);

console.log(invoiceJson);
