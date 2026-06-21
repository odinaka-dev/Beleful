"use client";

import * as React from "react";
import { CloseSquare } from "iconsax-reactjs";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Footer actions (buttons), rendered sticky at the bottom. */
  footer?: React.ReactNode;
}

/**
 * Lightweight accessible modal: overlay + centered panel, closes on backdrop
 * click or Escape. Body scroll is locked while open.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between border-b border-[#00452E]/10 p-5 sm:p-6">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#111111]">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-[#666666]">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-xl text-[#666666] transition-colors hover:bg-[#00452E]/5"
          >
            <CloseSquare size={22} variant="TwoTone" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>

        {footer && (
          <div className="border-t border-[#00452E]/10 p-5 sm:p-6">{footer}</div>
        )}
      </div>
    </div>
  );
}
