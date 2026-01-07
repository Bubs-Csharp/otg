import { useCounterAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CounterAnimationProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatNumber?: boolean;
}

export function CounterAnimation({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
  formatNumber = true,
  className,
  ...props
}: CounterAnimationProps) {
  const { ref, count } = useCounterAnimation(value, { duration });

  const formattedCount = formatNumber 
    ? count.toLocaleString() 
    : count.toString();

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={cn("tabular-nums", className)}
      {...props}
    >
      {prefix}{formattedCount}{suffix}
    </span>
  );
}
