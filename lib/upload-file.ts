import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseProjectId = process.env.SUPABASE_PROJECT_ID!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const bucketName = process.env.SUPABASE_BUCKET_NAME!;

// Initialize Supabase client
const supabase = createClient(`https://${supabaseProjectId}.supabase.co`, supabaseAnonKey);

async function uploadFile(file: File) {
  try {
    // Create unique filename to avoid conflicts
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `user_uploads/${fileName}`;

    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Upload error:", error.message);
      return { success: false, error: error.message };
    }

    console.log("File uploaded:", data);

    // Get public URL using the same bucket name
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    console.log("Public URL:", publicUrlData.publicUrl);

    return {
      success: true,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      fileName: fileName,
      originalName: file.name,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Upload failed" };
  }
}

export default uploadFile;
