import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", once = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

// Hook for staggered children animations
export function useStaggerAnimation(
  itemCount: number,
  options: UseScrollAnimationOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 100, ...scrollOptions } = options;
  const { ref, isVisible } = useScrollAnimation(scrollOptions);

  const getStaggerDelay = (index: number) => ({
    transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms",
  });

  return { ref, isVisible, getStaggerDelay };
}

// Hook for counter animation
export function useCounterAnimation(
  endValue: number,
  options: { duration?: number; startOnVisible?: boolean } = {}
) {
  const { duration = 2000, startOnVisible = true } = options;
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation({ once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startOnVisible || !isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, endValue, duration, startOnVisible]);

  return { ref, count, isVisible };
}
