import { cn } from "@/lib/utils";

interface FoodImageProps {
  emoji: string;
  gradient: [string, string];
  className?: string;
  /** Emoji font size in rem-ish scale via tailwind text classes. */
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<FoodImageProps["size"]>, string> = {
  sm: "text-3xl",
  md: "text-5xl",
  lg: "text-7xl",
};

/**
 * Stand-in for real food/vendor photography. Renders a branded gradient
 * tile with the dish emoji so the UI looks finished without image assets.
 */
export function FoodImage({
  emoji,
  gradient,
  className,
  size = "md",
}: FoodImageProps) {
  return (
    <div
      className={cn(
        "grid place-items-center overflow-hidden",
        SIZE[size],
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }}
      role="img"
      aria-label="Food image"
    >
      <span className="drop-shadow-sm">{emoji}</span>
    </div>
  );
}
