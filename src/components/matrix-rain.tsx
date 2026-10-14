"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas Matrix rain — katakana + binary + brackets.
 * Performance:
 *  - pauses when tab is hidden
 *  - pauses when prefers-reduced-motion
 *  - devicePixelRatio capped at 2 to avoid 4K canvas overhead
 *  - rAF throttle via interval draw (15fps-ish) — looks right and is cheap
 */
export function MatrixRain({
  className,
  opacity = 0.4,
  fps = 14,
}: {
  className?: string;
  opacity?: number;
  fps?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 14;
    const chars =
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプ0123456789#%$&*+-=<>{}[]()".split("");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.max(1, Math.floor(width / fontSize));
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let last = 0;
    const interval = 1000 / fps;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < interval) return;
      last = now;

      ctx.fillStyle = "rgba(5, 8, 16, 0.18)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px var(--font-geist-mono), ui-monospace, monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // lead character is brighter
        ctx.fillStyle = `rgba(180, 255, 220, ${opacity + 0.4})`;
        ctx.fillText(char, x, y);
        // trailing dimmer
        if (y > fontSize) {
          ctx.fillStyle = `rgba(60, 220, 140, ${opacity})`;
          ctx.fillText(char, x, y - fontSize);
        }
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.6 + Math.random() * 0.6;
      }
    };

    let started = false;
    const startTimer = setTimeout(() => {
      started = true;
      raf = requestAnimationFrame(draw);
    }, 1200);

    let isVisible = true;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        isVisible = e.isIntersecting;
        if (!isVisible) {
          cancelAnimationFrame(raf);
        } else if (started) {
          last = 0;
          raf = requestAnimationFrame(draw);
        }
      }
    }, { threshold: 0.05 });
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden || !isVisible) {
        cancelAnimationFrame(raf);
      } else if (started) {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      io.disconnect();
    };
  }, [opacity, fps]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  );
}
