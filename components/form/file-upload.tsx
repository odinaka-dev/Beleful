"use client";

import * as React from "react";
import { Gallery, DocumentUpload, CloseCircle } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  /** "avatar" = compact square preview, "banner" = wide preview. */
  variant?: "avatar" | "banner" | "document";
  hint?: string;
  optional?: boolean;
  accept?: string;
  onFileChange?: (file: File | null) => void;
}

/**
 * Image/document upload control with local preview. No network calls —
 * the selected File is surfaced via {@link FileUploadProps.onFileChange}.
 */
export function FileUpload({
  label,
  variant = "document",
  hint,
  optional,
  accept = "image/*",
  onFileChange,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0] ?? null;
    onFileChange?.(file);
    setFileName(file?.name ?? null);
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    setFileName(null);
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#111111]">{label}</span>
        {optional && (
          <span className="text-xs font-medium text-[#666666]">Optional</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#00452E]/20 bg-[#00452E]/[0.03] transition-all duration-200 hover:border-[#00452E]/40 hover:bg-[#00452E]/[0.06]",
          variant === "avatar" && "h-28 w-28",
          variant === "banner" && "h-36",
          variant === "document" && "h-32",
        )}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
            />
            <span
              onClick={clear}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#DC2626] shadow-sm"
            >
              <CloseCircle size={18} variant="Bold" />
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-4 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#00452E]/10 text-[#00452E]">
              {variant === "document" ? (
                <DocumentUpload size={20} variant="TwoTone" />
              ) : (
                <Gallery size={20} variant="TwoTone" />
              )}
            </span>
            {fileName ? (
              <span className="line-clamp-1 text-xs font-medium text-[#00452E]">
                {fileName}
              </span>
            ) : (
              <span className="text-xs font-medium text-[#666666]">
                {variant === "avatar" ? "Upload" : "Tap to upload"}
              </span>
            )}
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {hint && <p className="mt-1.5 text-xs text-[#666666]">{hint}</p>}
    </div>
  );
}
