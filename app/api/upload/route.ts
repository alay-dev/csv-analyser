import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseProjectId = process.env.SUPABASE_PROJECT_ID!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const bucketName = process.env.SUPABASE_BUCKET_NAME!;

// Create Supabase client
const supabase = createClient(`https://${supabaseProjectId}.supabase.co`, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type (optional - add CSV validation if needed)
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json({ error: "Only CSV files are allowed" }, { status: 400 });
    }

    // Create unique filename to avoid conflicts
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `user_uploads/${fileName}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Upload error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL using the same bucket name
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      fileName: fileName,
      url: publicUrlData?.publicUrl,
      publicId: data.path,
      fileSize: file.size,
      path: data.path,
      publicUrl: publicUrlData?.publicUrl,
      originalName: file.name,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
