import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

type AnimationType = 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right" 
  | "scale-in" 
  | "blur-in"
  | "slide-up"
  | "slide-down";

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
}

const animationClasses: Record<AnimationType, { initial: string; visible: string }> = {
  "fade-up": {
    initial: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    initial: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    initial: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    initial: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "scale-in": {
    initial: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
  "blur-in": {
    initial: "opacity-0 blur-sm",
    visible: "opacity-100 blur-0",
  },
  "slide-up": {
    initial: "opacity-0 translate-y-12",
    visible: "opacity-100 translate-y-0",
  },
  "slide-down": {
    initial: "opacity-0 -translate-y-12",
    visible: "opacity-100 translate-y-0",
  },
};

export const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  (
    {
      animation = "fade-up",
      delay = 0,
      duration = 700,
      threshold = 0.1,
      once = true,
      as: Component = "div",
      className,
      children,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const { ref, isVisible } = useScrollAnimation({ threshold, once });
    const animClasses = animationClasses[animation];

    return (
      <Component
        ref={(node) => {
          // Handle both refs
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        className={cn(
          "transition-all ease-out",
          isVisible ? animClasses.visible : animClasses.initial,
          className
        )}
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";

// Staggered children wrapper
interface StaggeredContainerProps extends HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number;
  animation?: AnimationType;
  duration?: number;
  threshold?: number;
}

export function StaggeredContainer({
  staggerDelay = 100,
  animation = "fade-up",
  duration = 600,
  threshold = 0.1,
  className,
  children,
  ...props
}: StaggeredContainerProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, once: true });
  const animClasses = animationClasses[animation];

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className} {...props}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={cn(
                "transition-all ease-out",
                isVisible ? animClasses.visible : animClasses.initial
              )}
              style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms",
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
