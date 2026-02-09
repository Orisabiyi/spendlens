import { NextRequest, NextResponse } from "next/server";
import { geminiModel, RECEIPT_EXTRACTION_PROMPT } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const result = await geminiModel.generateContent([
      RECEIPT_EXTRACTION_PROMPT,
      {
        inlineData: {
          data: image,
          mimeType: mimeType || "image/jpeg",
        },
      },
    ]);

    const response = result.response;
    const text = response.text();

    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const data = JSON.parse(cleanedText);

    // Check if the image is a valid receipt or invoice
    if (data.documentType === "other") {
      return NextResponse.json(
        {
          success: false,
          isValidDocument: false,
          error:
            data.error ||
            "The uploaded image is not a receipt or invoice. Please upload a valid receipt or invoice image.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      isValidDocument: true,
      data,
    });
  } catch (error) {
    console.error("Scan receipt error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to scan receipt. Please try again." },
      { status: 500 }
    );
  }
}