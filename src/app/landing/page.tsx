"use client";

import { useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { uploadPhotos } from "@/api/requests";

export default function LandingPage() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files?.length) return;

    setUploadError(null);
    setUploading(true);
    try {
      await uploadPhotos(Array.from(files));
      event.target.value = "";
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm p-8">
        <p className="text-black dark:text-zinc-50 text-lg mb-2">hello</p>
        <p className="text-black dark:text-zinc-50 text-lg mb-2">
          {user?.firstName ?? ""} {user?.lastName ?? ""}
        </p>
        <p className="text-black dark:text-zinc-50 text-lg mb-6">
          this is the landing page
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading}
          className="w-full px-4 py-2 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? "Uploading…" : "Upload photos"}
        </button>
        {uploadError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {uploadError}
          </p>
        )}
      </div>
    </div>
  );
}
