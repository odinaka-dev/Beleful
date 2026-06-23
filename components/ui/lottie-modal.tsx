"use client";

import * as React from "react";
import { Dialog, Portal } from "@chakra-ui/react";
import Lottie from "lottie-react";
import { PrimaryButton } from "@/components/ui/primary-button";

interface LottieModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lottie: unknown;
  lottieLoop?: boolean;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function LottieModal({
  open,
  onOpenChange,
  lottie,
  lottieLoop = true,
  title,
  description,
  actionLabel,
  onAction,
  children,
}: LottieModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement="center"
      motionPreset="scale"
    >
      <Portal>
        <Dialog.Backdrop className="bg-black/40 backdrop-blur-sm" />
        <Dialog.Positioner>
          <Dialog.Content className="w-[92%] max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <Dialog.CloseTrigger
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl text-[#666666] transition-colors hover:bg-[#00452E]/5"
              aria-label="Close"
            >
              ✕
            </Dialog.CloseTrigger>

            <div className="w-40 mx-auto">
              <Lottie animationData={lottie} loop={lottieLoop} />
            </div>

            <Dialog.Title className="mt-2 text-2xl font-bold text-[#111111]">
              {title}
            </Dialog.Title>

            {description && (
              <Dialog.Description className="mt-3 text-[15px] leading-relaxed text-[#666666]">
                {description}
              </Dialog.Description>
            )}

            {children}

            {actionLabel && (
              <PrimaryButton
                className="mt-7"
                onClick={() => {
                  onAction?.();
                  onOpenChange(false);
                }}
              >
                {actionLabel}
              </PrimaryButton>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
