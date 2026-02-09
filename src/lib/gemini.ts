import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

export const RECEIPT_EXTRACTION_PROMPT = `You are an expert receipt parser. Analyze this receipt image and extract the following information in JSON format.

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "merchant": "Store/Restaurant name",
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
- If a field is not visible on the receipt, use null
- For Nigerian receipts, default currency to "NGN"
- Categorize based on merchant type and items purchased
- Set confidence to "high" if text is clear, "medium" if partially readable, "low" if mostly unclear
- Extract ALL visible line items
- Prices should be numbers, not strings
- Date must be in YYYY-MM-DD format`;
