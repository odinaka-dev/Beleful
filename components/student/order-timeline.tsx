import { TickCircle } from "iconsax-reactjs";
import { ORDER_STEPS, type OrderStatus } from "@/helpers/student.helpers";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  current: OrderStatus;
}

/** Vertical status timeline for the order-tracking page. */
export function OrderTimeline({ current }: OrderTimelineProps) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.status === current);

  return (
    <ol className="relative">
      {ORDER_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const isLast = i === ORDER_STEPS.length - 1;

        return (
          <li key={step.status} className="flex gap-4 pb-1">
            {/* Marker + connector */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border-2 transition-colors",
                  done && "border-[#00452E] bg-[#00452E] text-white",
                  active && "border-[#00452E] bg-[#FCD882] text-[#00452E]",
                  !done && !active && "border-[#00452E]/15 bg-white text-transparent",
                )}
              >
                {done ? (
                  <TickCircle size={18} variant="Bold" />
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
                  active ? "text-[#00452E]" : done ? "text-[#111111]" : "text-[#9CA3AF]",
                )}
              >
                {step.label}
              </p>
              {active && (
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
