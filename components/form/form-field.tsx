"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.ComponentProps<"input"> {
  label: string;
  /** Optional helper text shown below the field. */
  hint?: string;
  /** Validation message; when present the field renders in an error state. */
  error?: string;
  /** Marks the field as optional in the label. */
  optional?: boolean;
  /** Node rendered on the leading edge of the field (e.g. an icon). */
  leftElement?: React.ReactNode;
  /** Node rendered on the trailing edge of the field (e.g. a toggle button). */
  rightElement?: React.ReactNode;
}

/**
 * Labelled text input shared across every auth form.
 * Tailwind-first to stay consistent with the BELEFUL landing page.
 */
export function FormField({
  label,
  hint,
  error,
  optional,
  leftElement,
  rightElement,
  id,
  className,
  ...props
}: FormFieldProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="w-full">
      <label
        htmlFor={fieldId}
        className="mb-2 flex items-center justify-between text-sm font-semibold text-[#111111]"
      >
        <span>{label}</span>
        {optional && (
          <span className="text-xs font-medium text-[#666666]">Optional</span>
        )}
      </label>

      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border bg-white px-4 transition-all duration-200",
          "focus-within:border-[#00452E] focus-within:ring-4 focus-within:ring-[#00452E]/10",
          error ? "border-[#DC2626]" : "border-[#00452E]/15",
        )}
      >
        {leftElement && (
          <span className="text-[#666666]">{leftElement}</span>
        )}
        <input
          id={fieldId}
          aria-invalid={!!error}
          className={cn(
            "h-12 w-full min-w-0 flex-1 bg-transparent text-[15px] text-[#111111] outline-none placeholder:text-[#9CA3AF]",
            className,
          )}
          {...props}
        />
        {rightElement}
      </div>

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-[#666666]">{hint}</p>
      ) : null}
    </div>
  );
}
