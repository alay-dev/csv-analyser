"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/store/data";
import { Upload, FileText, X, Database } from "lucide-react";
interface CSVUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeable?: boolean;
}

type CreateSessionResponse = {
  session_id: string;
  message: string;
};

export const CSVUploadModal = ({ open, onOpenChange, closeable = true }: CSVUploadModalProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState<"custom" | "sample" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setFileData, setSessionId } = useDataStore();

  // Sample CSV URL - replace with your actual sample CSV URL
  const SAMPLE_CSV_URL = "https://jigdqwfhhikqsochomtq.supabase.co/storage/v1/object/public/csv/user_uploads/1754643085786_Netflix.csv";

  const handleFileSelect = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Please select a CSV file");
      return;
    }

    // Validate file size (10MB limit)
    // const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    // if (file.size > maxSize) {
    //   alert("File size exceeds 10MB limit");
    //   return;
    // }

    setIsUploading("custom");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setFileData({ fileName: file.name, fileUrl: result.url });
      console.log("Uploaded file:", result);

      const createRes = await fetch("http://127.0.0.1:8000/session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csv_path: result.url }),
      });

      const parsedCreateRes = (await createRes.json()) as CreateSessionResponse;

      setSessionId(parsedCreateRes.session_id);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsUploading(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSampleCSV = async () => {
    setIsUploading("sample");

    try {
      // Set the sample file data
      setFileData({ fileName: "sample-iris.csv", fileUrl: SAMPLE_CSV_URL });
      console.log("Using sample CSV:", SAMPLE_CSV_URL);

      // Create session with sample CSV
      const createRes = await fetch("http://127.0.0.1:8000/session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csv_path: SAMPLE_CSV_URL }),
      });

      const parsedCreateRes = (await createRes.json()) as CreateSessionResponse;
      setSessionId(parsedCreateRes.session_id);
    } catch (error) {
      console.error("Error loading sample CSV:", error);
      alert(`Error loading sample CSV: ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsUploading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeable ? onOpenChange : () => {}}>
      <DialogContent className="p-8 ">
        <DialogHeader className="hidden">
          <DialogTitle>Upload CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Drag and drop your CSV file here</p>
              <p className="text-xs text-gray-500">or click to browse files</p>
            </div>
            <Button variant="outline" className="mt-4" onClick={handleBrowseClick} disabled={Boolean(isUploading)}>
              {isUploading === "custom" ? "Uploading..." : "Browse Files"}
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileInputChange} className="hidden" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button variant="secondary" onClick={handleSampleCSV} disabled={Boolean(isUploading)} className="w-full">
            <Database className="mr-2 h-4 w-4" />
            {isUploading === "sample" ? "Loading..." : "Use Sample CSV (Netflix Dataset)"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
