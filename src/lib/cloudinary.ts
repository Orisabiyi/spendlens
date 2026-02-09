import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadReceiptImage(base64Image: string): Promise<string> {
  const result = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${base64Image}`,
    {
      folder: "spendlens/receipts",
      resource_type: "image",
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 1200, crop: "limit" },
      ],
    }
  );

  return result.secure_url;
}
