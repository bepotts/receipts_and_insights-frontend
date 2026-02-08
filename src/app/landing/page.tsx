"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { getAllPhotos, uploadPhotos } from "@/api/requests";

type PhotoItem = { file_content: string; [key: string]: unknown };

function isImageContent(content: string): boolean {
  return (
    content.startsWith("data:image") ||
    content.startsWith("/9j/") ||
    /^[A-Za-z0-9+/=]+$/.test(content.slice(0, 100))
  );
}

export default function LandingPage() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photosError, setPhotosError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPhotos() {
      setPhotosLoading(true);
      setPhotosError(null);
      try {
        const data = await getAllPhotos();
        if (!cancelled) setPhotos((data as PhotoItem[]) ?? []);
      } catch (err) {
        if (!cancelled) {
          setPhotosError(
            err instanceof Error ? err.message : "Failed to load photos",
          );
        }
      } finally {
        if (!cancelled) setPhotosLoading(false);
      }
    }

    fetchPhotos();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  async function uploadFilesAndRefresh(files: File[]) {
    setUploadError(null);
    setUploading(true);
    try {
      await uploadPhotos(files);
      const data = await getAllPhotos();
      setPhotos((data as PhotoItem[]) ?? []);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files?.length) return;
    event.target.value = "";
    await uploadFilesAndRefresh(Array.from(files));
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

        <div className="mt-8">
          <h2 className="text-black dark:text-zinc-50 text-lg font-medium mb-3">
            Your photos
          </h2>
          {photosLoading && (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading…</p>
          )}
          {photosError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {photosError}
            </p>
          )}
          {!photosLoading && !photosError && photos.length === 0 && (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              No photos yet.
            </p>
          )}
          {!photosLoading && !photosError && photos.length > 0 && (
            <ul className="space-y-4">
              {photos.map((photo, index) => {
                const content = photo?.file_content ?? "";
                const isImage = isImageContent(content);
                return (
                  <li
                    key={index}
                    className="rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                  >
                    {isImage ? (
                      <div className="relative w-full h-64 bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={
                            content.startsWith("data:")
                              ? content
                              : `data:image/jpeg;base64,${content}`
                          }
                          alt={`Photo ${index + 1}`}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <pre className="text-xs text-zinc-600 dark:text-zinc-400 overflow-auto max-h-48 p-3">
                        {content}
                      </pre>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
