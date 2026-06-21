import { TickCircle, CloseCircle } from "iconsax-reactjs";
import type { OrderStep } from "@/helpers/student.helpers";
import { cn } from "@/lib/utils";

/** Vertical status timeline for the order-tracking page. */
export function OrderTimeline({ steps }: { steps: OrderStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const done = step.state === "done";
        const active = step.state === "active";
        const isLast = i === steps.length - 1;
        const isRejected = step.key === "rejected";

        return (
          <li key={step.key} className="flex gap-4 pb-1">
            {/* Marker + connector */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border-2 transition-colors",
                  done && "border-[#00452E] bg-[#00452E] text-white",
                  active && !isRejected && "border-[#00452E] bg-[#FCD882] text-[#00452E]",
                  active && isRejected && "border-[#DC2626] bg-[#FEE2E2] text-[#DC2626]",
                  !done && !active && "border-[#00452E]/15 bg-white text-transparent",
                )}
              >
                {done ? (
                  <TickCircle size={18} variant="Bold" />
                ) : active && isRejected ? (
                  <CloseCircle size={18} variant="Bold" />
                ) : (
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      active ? "bg-[#00452E]" : "bg-[#00452E]/20",
                    )}
                  />
                )}
              </span>
              {!isLast && (
                <span
                  className={cn(
                    "my-1 w-0.5 flex-1",
                    done ? "bg-[#00452E]" : "bg-[#00452E]/12",
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "font-semibold",
                  active
                    ? isRejected
                      ? "text-[#DC2626]"
                      : "text-[#00452E]"
                    : done
                      ? "text-[#111111]"
                      : "text-[#9CA3AF]",
                )}
              >
                {step.label}
              </p>
              {active && !isRejected && (
                <p className="mt-0.5 text-xs text-[#666666]">In progress…</p>
              )}
              {done && (
                <p className="mt-0.5 text-xs text-[#666666]">Completed</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
