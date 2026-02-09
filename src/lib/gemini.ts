import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const RECEIPT_EXTRACTION_PROMPT = `You are an expert document analyzer and receipt parser.

STEP 1 — CLASSIFY THE IMAGE:
Determine if this image is one of:
- "receipt" (store receipt, POS printout, sales slip, etc.)
- "invoice" (bill, invoice, utility bill, payment notice, etc.)
- "other" (not a receipt or invoice — e.g. random photo, screenshot, document, meme, etc.)

STEP 2 — IF "receipt" or "invoice", extract data. IF "other", return only the classification.

Return ONLY valid JSON with NO markdown and NO code blocks.

If the image is NOT a receipt or invoice, return:
{
  "documentType": "other",
  "error": "The uploaded image is not a receipt or invoice. Please upload a valid receipt or invoice image."
}

If the image IS a receipt or invoice, return:
{
  "documentType": "receipt" or "invoice",
  "merchant": "Store/Restaurant/Company name",
  "date": "YYYY-MM-DD",
  "time": "HH:MM" or null,
  "total": 0.00,
  "currency": "NGN" or "USD" or detected currency,
  "category": "One of: Food & Dining, Transportation, Shopping, Entertainment, Healthcare, Utilities, Groceries, Other",
  "paymentMethod": "Cash, Card, Transfer, POS, or null",
  "taxAmount": 0.00 or null,
  "confidence": "high, medium, or low",
  "items": [
    {
      "name": "Item name",
      "quantity": "1",
      "price": 0.00
    }
  ],
  "notes": "Any additional observations about the receipt"
}

Rules:
- ALWAYS include the "documentType" field
- If a field is not visible on the receipt, use null
- For Nigerian receipts, default currency to "NGN"
- Categorize based on merchant type and items purchased
- Set confidence to "high" if text is clear, "medium" if partially readable, "low" if mostly unclear
- Extract ALL visible line items
- Prices should be numbers, not strings
- Date must be in YYYY-MM-DD format`;
