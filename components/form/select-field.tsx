"use client";

import * as React from "react";
import { ArrowDown2 } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.ComponentProps<"select"> {
  label: string;
  options: Array<string | SelectOption>;
  error?: string;
  placeholder?: string;
}

/** Labelled native select styled to match {@link FormField}. */
export function SelectField({
  label,
  options,
  error,
  placeholder = "Select an option",
  id,
  className,
  value,
  ...props
}: SelectFieldProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="w-full">
      <label
        htmlFor={fieldId}
        className="mb-2 block text-sm font-semibold text-[#111111]"
      >
        {label}
      </label>

      <div
        className={cn(
          "relative flex items-center rounded-2xl border bg-white transition-all duration-200",
          "focus-within:border-[#00452E] focus-within:ring-4 focus-within:ring-[#00452E]/10",
          error ? "border-[#DC2626]" : "border-[#00452E]/15",
        )}
      >
        <select
          id={fieldId}
          aria-invalid={!!error}
          // Controlled when a `value` is supplied; otherwise fall back to the
          // empty placeholder via defaultValue (avoids mixing both props).
          value={value}
          defaultValue={value === undefined ? "" : undefined}
          className={cn(
            "h-12 w-full appearance-none bg-transparent px-4 pr-10 text-[15px] text-[#111111] outline-none",
            "[&:invalid]:text-[#9CA3AF]",
            className,
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => {
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        <ArrowDown2
          size={18}
          color="#666666"
          className="pointer-events-none absolute right-4"
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{error}</p>
      )}
    </div>
  );
}
