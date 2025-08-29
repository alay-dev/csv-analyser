// Utility function to upload files using the API route

export interface UploadResponse {
  success: boolean;
  fileName?: string;
  url?: string;
  publicId?: string;
  fileSize?: number;
  path?: string;
  publicUrl?: string;
  originalName?: string;
  error?: string;
}

export async function uploadFileToAPI(file: File): Promise<UploadResponse> {
  try {
    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return { success: false, error: "Only CSV files are allowed" };
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return { success: false, error: "File size exceeds 10MB limit" };
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Upload failed" };
    }

    return result;
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

// Example usage function
export async function handleFileUpload(file: File, onSuccess?: (result: UploadResponse) => void, onError?: (error: string) => void) {
  const result = await uploadFileToAPI(file);

  if (result.success) {
    console.log("File uploaded successfully:", result);
    onSuccess?.(result);
  } else {
    console.error("Upload failed:", result.error);
    onError?.(result.error || "Upload failed");
  }

  return result;
}
