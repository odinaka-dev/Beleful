"use client";

import * as React from "react";
import { Eye, EyeSlash, Lock } from "iconsax-reactjs";
import { FormField } from "./form-field";
import { getPasswordStrength } from "@/helpers/auth.helpers";

interface PasswordFieldProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
  error?: string;
  /** Renders a 4-segment strength meter beneath the field. */
  showStrength?: boolean;
}

/**
 * Password input with a show/hide toggle and an optional strength indicator.
 */
export function PasswordField({
  label = "Password",
  error,
  showStrength = false,
  value,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);
  const strength = getPasswordStrength(String(value ?? ""));

  return (
    <div className="w-full">
      <FormField
        label={label}
        type={visible ? "text" : "password"}
        value={value}
        error={error}
        leftElement={<Lock size={18} variant="TwoTone" color="#666666" />}
        rightElement={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="grid h-8 w-8 place-items-center rounded-full text-[#666666] transition-colors hover:bg-[#00452E]/5 hover:text-[#00452E]"
          >
            {visible ? (
              <EyeSlash size={18} variant="TwoTone" />
            ) : (
              <Eye size={18} variant="TwoTone" />
            )}
          </button>
        }
        {...props}
      />

      {showStrength && value ? (
        <div className="mt-2">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((seg) => (
              <span
                key={seg}
                className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor:
                    seg <= strength.score ? strength.color : "#E5E7EB",
                }}
              />
            ))}
          </div>
          <p
            className="mt-1.5 text-xs font-semibold"
            style={{ color: strength.color }}
          >
            {strength.label} password
          </p>
        </div>
      ) : null}
    </div>
  );
}
