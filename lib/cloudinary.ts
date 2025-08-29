// Cloudinary upload functionality as fallback
export async function uploadToCloudinaryDirect(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

  if (!cloudName || !apiKey) {
    throw new Error("Cloudinary configuration missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset"); // You'll need to create this in Cloudinary
  formData.append("folder", "csv_uploads");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const result = await response.json();
  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    bytes: result.bytes,
  };
}
