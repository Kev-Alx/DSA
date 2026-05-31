"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  baseAlpha: number;
  colorHsla: string;
  isWhite: boolean; // Flag to preserve white highlights across theme updates
  history: { x: number; y: number }[];
  impulseTimer: number;
  impulseVx: number;
  impulseVy: number;
  trailActive: boolean;
}

const BASE_SPEED_FACTOR = 4.5;
const DEAD_ZONE_WIDTH = 400;

const lightColors = [
  "28, 100%, 72%", // Warm orange
  "44, 100%, 68%", // Amber-yellow
  "52, 100%, 68%", // Pastel yellow
  // "0, 0%, 100%, 0.5", // White highlight
];

const darkColors = [
  "190, 70%, 60%", // Cyan
  "220, 80%, 30%", // Dark Blue
  "0, 0%, 100%, 0.4", // White highlight
];

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 10;
    const trailLength = 60;

    let lastScrollY = window.scrollY;
    let topGlowOpacity = 1;
    let bottomGlowOpacity = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseVx = 0;
    let mouseVy = 0;
    let lastMouseX = -1000;
    let lastMouseY = -1000;

    // Track active theme state inside the canvas loop
    let isDarkMode = document.documentElement.classList.contains("dark");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const midX = canvas.width / 2;
      const halfDeadZone = DEAD_ZONE_WIDTH / 2;
      const currentPalette = isDarkMode ? darkColors : lightColors;

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 3.1 + 1.75;
        const isLeftSide = Math.random() < 0.5;
        const bVx =
          (isLeftSide ? -Math.random() : Math.random()) *
          0.08 *
          BASE_SPEED_FACTOR;
        const bVy = ((Math.random() - 0.5) * 0.15 - 0.05) * BASE_SPEED_FACTOR;

        let spawnX = 0;
        if (isLeftSide) {
          spawnX = Math.random() * Math.max(0, midX - halfDeadZone);
        } else {
          spawnX =
            midX +
            halfDeadZone +
            Math.random() * Math.max(0, midX - halfDeadZone);
        }

        const chosenColor =
          currentPalette[Math.floor(Math.random() * currentPalette.length)];

        particles.push({
          x: spawnX,
          y: Math.random() * canvas.height,
          radius,
          vx: bVx,
          vy: bVy,
          baseVx: bVx,
          baseVy: bVy,
          baseAlpha: Math.random() * 0.45 + 0.3,
          colorHsla: chosenColor,
          isWhite: chosenColor.startsWith("0, 0%"),
          history: [],
          impulseTimer: 0,
          impulseVx: 0,
          impulseVy: 0,
          trailActive: false,
        });
      }
    };

    // --- REALTIME THEME COUPLING ---
    const updateParticleColorsOnThemeChange = (dark: boolean) => {
      const targetPalette = dark ? darkColors : lightColors;
      // Filter out the white colors so we only re-roll accent colors
      const accentColors = targetPalette.filter((c) => !c.startsWith("0, 0%"));
      const whiteColor =
        targetPalette.find((c) => c.startsWith("0, 0%")) || "0, 0%, 100%, 0.4";

      particles.forEach((p) => {
        if (p.isWhite) {
          p.colorHsla = whiteColor;
        } else {
          p.colorHsla =
            accentColors[Math.floor(Math.random() * accentColors.length)];
        }
      });
    };

    const observer = new MutationObserver(() => {
      const darkCheck = document.documentElement.classList.contains("dark");
      if (darkCheck !== isDarkMode) {
        isDarkMode = darkCheck;
        updateParticleColorsOnThemeChange(isDarkMode);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;

      if (deltaY !== 0) {
        particles.forEach((p) => {
          p.vy += deltaY * 0.01;
          p.trailActive = true;
        });
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        topGlowOpacity = 0;
      } else {
        topGlowOpacity = 1;
      }

      const totalPageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const distanceFromBottom =
        totalPageHeight - (currentScrollY + viewportHeight);

      const triggerZone = 250;
      if (distanceFromBottom <= triggerZone) {
        bottomGlowOpacity = 1 - distanceFromBottom / triggerZone;
      } else {
        bottomGlowOpacity = 0;
      }

      lastScrollY = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (lastMouseX !== -1000) {
        mouseVx = mouseX - lastMouseX;
        mouseVy = mouseY - lastMouseY;
      }
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      mouseVx = 0;
      mouseVy = 0;
      lastMouseX = -1000;
      lastMouseY = -1000;
    };

    let currentTopOpacity = 1;
    let currentBottomOpacity = 0;

    // --- ADVANCED DYNAMIC GLOW GENERATION ---
    const applyGradientStops = (gradient: CanvasGradient, opacity: number) => {
      if (isDarkMode) {
        // Dark Mode: Cyan into Deep Navy
        gradient.addColorStop(0, `rgba(45, 140, 255, ${0.45 * opacity})`);
        gradient.addColorStop(0.4, `rgba(20, 40, 90, ${0.35 * opacity})`);
      } else {
        // Light Mode: Vibrant Orange, Light Orange, Yellow
        gradient.addColorStop(0, `rgba(251, 146, 60, ${0.5 * opacity})`);
        gradient.addColorStop(0.25, `rgba(253, 186, 116, ${0.55 * opacity})`);
        gradient.addColorStop(0.55, `rgba(253, 224, 71, ${0.4 * opacity})`);
      }
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    };

    const drawTopGradientGlow = () => {
      if (currentTopOpacity <= 0) return;
      const gradientHeight = 100;
      const gradient = ctx.createLinearGradient(0, 0, 0, gradientHeight);
      applyGradientStops(gradient, currentTopOpacity);

      ctx.save();
      ctx.filter = "blur(50px)";
      ctx.fillStyle = gradient;
      ctx.fillRect(-20, -20, canvas.width + 40, gradientHeight + 40);
      ctx.restore();
      ctx.filter = "none";
    };

    const drawBottomGradientGlow = () => {
      if (currentBottomOpacity <= 0) return;
      const gradientHeight = 300;
      const startY = canvas.height - gradientHeight;
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, startY);
      applyGradientStops(gradient, currentBottomOpacity);

      ctx.save();
      ctx.filter = "blur(80px)";
      ctx.fillStyle = gradient;
      ctx.fillRect(-20, startY - 20, canvas.width + 40, gradientHeight + 40);
      ctx.restore();
      ctx.filter = "none";
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      currentTopOpacity += (topGlowOpacity - currentTopOpacity) * 0.1;
      currentBottomOpacity += (bottomGlowOpacity - currentBottomOpacity) * 0.1;

      drawTopGradientGlow();
      drawBottomGradientGlow();

      mouseVx *= 0.85;
      mouseVy *= 0.85;

      const midX = canvas.width / 2;
      const halfDeadZone = DEAD_ZONE_WIDTH / 2;
      const leftBoundary = midX - halfDeadZone;
      const rightBoundary = midX + halfDeadZone;

      particles.forEach((p) => {
        if (p.trailActive) {
          p.history.push({ x: p.x, y: p.y });
          if (p.history.length > trailLength) p.history.shift();
        }

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 100;

        if (
          distance < interactionRadius &&
          (Math.abs(mouseVx) > 0.5 || Math.abs(mouseVy) > 0.5)
        ) {
          p.impulseTimer = 36;
          p.impulseVx = mouseVx * 0.06;
          p.impulseVy = mouseVy * 0.06;
          p.trailActive = true;
        }

        if (p.impulseTimer > 0) {
          p.vx += p.impulseVx;
          p.vy += p.impulseVy;
          p.impulseVx *= 0.88;
          p.impulseVy *= 0.88;
          p.impulseTimer--;
        }

        p.vx += (p.baseVx - p.vx) * 0.06;
        p.vy += (p.baseVy - p.vy) * 0.06;

        const dvx = Math.abs(p.vx - p.baseVx);
        const dvy = Math.abs(p.vy - p.baseVy);
        if (p.trailActive && p.impulseTimer === 0 && dvx < 0.08 && dvy < 0.08) {
          p.trailActive = false;
          p.history = [];
        }

        p.x += p.vx;
        p.y += p.vy;

        let wrapped = false;

        if (!p.trailActive) {
          if (p.x > leftBoundary && p.x < midX) {
            p.x = leftBoundary;
            p.vx *= -1;
            p.baseVx *= -1;
          }
          if (p.x < rightBoundary && p.x >= midX) {
            p.x = rightBoundary;
            p.vx *= -1;
            p.baseVx *= -1;
          }
        }

        if (p.x < 0) {
          p.x = canvas.width;
          wrapped = true;
        }
        if (p.x > canvas.width) {
          p.x = 0;
          wrapped = true;
        }
        if (p.y < 0) {
          p.y = canvas.height;
          wrapped = true;
        }
        if (p.y > canvas.height) {
          p.y = 0;
          wrapped = true;
        }

        if (wrapped) {
          p.history = [];
          p.trailActive = false;
        }

        const hasAlpha = p.colorHsla.split(",").length === 4;

        // Render Trail
        if (p.trailActive) {
          for (let i = 0; i < p.history.length; i++) {
            const point = p.history[i];
            const t = i / p.history.length;
            const trailAlpha = t * p.baseAlpha * 0.14;
            const trailRadius = p.radius * t * 0.7;
            ctx.beginPath();
            ctx.arc(point.x, point.y, trailRadius, 0, Math.PI * 2);
            ctx.fillStyle = hasAlpha
              ? `hsla(${p.colorHsla})`
              : `hsla(${p.colorHsla}, ${trailAlpha})`;
            ctx.fill();
          }
        }

        // Render Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = hasAlpha
          ? `hsla(${p.colorHsla})`
          : `hsla(${p.colorHsla}, ${p.baseAlpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
    </div>
  );
}
