"use client";

import * as React from "react";
import { TickSquare } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  error?: string;
  id?: string;
}

/** Accessible custom checkbox with rich label content (e.g. terms links). */
export function CheckboxField({
  checked,
  onChange,
  children,
  error,
  id,
}: CheckboxFieldProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  return (
    <div>
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          id={fieldId}
          onClick={() => onChange(!checked)}
          className={cn(
            "mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-md border transition-all duration-200",
            checked
              ? "border-[#00452E] bg-[#00452E] text-white"
              : "border-[#00452E]/30 bg-white",
          )}
        >
          {checked && <TickSquare size={14} variant="Bold" color="#ffffff" />}
        </button>
        <label
          htmlFor={fieldId}
          className="cursor-pointer text-sm leading-relaxed text-[#666666]"
        >
          {children}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{error}</p>
      )}
    </div>
  );
}
