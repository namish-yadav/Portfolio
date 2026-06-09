"use client";

import dynamic from "next/dynamic";
import BubbleMenu from "@/components/BubbleMenu";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import Footer from "@/components/sections/Footer";
import SplashCursor from "@/components/SplashCursor";
import AnimatedContent from "@/components/AnimatedContent"; // ← new import

const FloatingLines = dynamic(() => import("@/components/FloatingLines"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f]">

      {/* Splash Cursor — unchanged */}
      <SplashCursor
        DENSITY_DISSIPATION={1.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={1}
        SPLAT_RADIUS={0.05}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING={true}
        RAINBOW_MODE={false}
        COLOR="#2dff12"
      />

      {/* Background — unchanged */}
      <div className="fixed inset-0 z-0">
        <FloatingLines
          gradientStart="#e945f5"
          gradientMid="#6f6f6f"
          gradientEnd="#6a6a6a"
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={8}
          lineDistance={8}
          bendRadius={8}
          bendStrength={-2}
          interactive={true}
          parallax={true}
          animationSpeed={1}
        />
      </div>

      {/* Navigation — unchanged */}
      <BubbleMenu
        logo={<span className="font-bold text-[#0a0a0f]">Namish</span>}
        menuBg="#ffffff"
        menuContentColor="#0a0a0f"
        useFixedPosition={true}
      />

      {/* ─────────────────────────────────────────────────────────────────────
          Content — every section is now wrapped in <AnimatedContent>.
          Each wrapper starts the child at visibility:hidden and plays a
          GSAP tween the moment ScrollTrigger sees it enter the viewport.
          ───────────────────────────────────────────────────────────────── */}
      <div className="relative z-10">

        {/* ── HERO ──────────────────────────────────────────────────────────
            threshold={0.01}  → fires when just 1% of the element is visible.
                                Since the hero is the very first thing on the
                                page, 1% is visible immediately on load, so the
                                animation plays right away — no scrolling needed.
            delay={0.1}       → one short pause so the browser finishes its
                                first paint before the tween kicks off.
            direction="vertical", reverse=false, distance=60
                              → element starts 60px below its natural position
                                and slides up into place.
            scale={0.97}      → starts very slightly smaller, grows to 1.
            ease="power4.out" → fast start, smooth deceleration — feels snappy.
        */}
        <AnimatedContent
          distance={60}
          direction="vertical"
          reverse={false}
          duration={1.1}
          ease="power4.out"
          initialOpacity={0}
          animateOpacity
          scale={0.97}
          threshold={0.01}
          delay={0.1}
        >
          <HeroSection />
        </AnimatedContent>

        {/* ── ABOUT ─────────────────────────────────────────────────────────
            threshold={0.15}  → fires when 15% of the section is on screen.
                                Gives a comfortable scroll-in trigger point.
            direction="horizontal", reverse=false, distance=90
                              → slides in from the LEFT (positive x offset
                                means it starts to the right; reverse=false
                                means the offset is +90px, i.e. from the left
                                when combined with the horizontal axis logic).
            scale={0.98}      → barely perceptible scale, just adds depth.
            ease="power3.out" → slightly gentler than the hero.
        */}
        <AnimatedContent
          distance={90}
          direction="vertical"
          reverse={false}
          duration={1.0}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.98}
          threshold={0.15}
          delay={0}
        >
          <AboutSection />
        </AnimatedContent>

        {/* ── PROJECTS ──────────────────────────────────────────────────────
            threshold={0.12}  → fires a bit earlier than About so the heavy
                                bento grid has time to render before it's seen.
            direction="vertical", reverse=false, distance=80
                              → rises up from below, matching the energy of
                                the bento cards' own hover animations.
            scale={0.96}      → slightly more dramatic scale than About,
                                emphasising the grid's weight.
            ease="power3.out" → same easing family keeps the page coherent.
        */}
        <AnimatedContent
          distance={80}
          direction="vertical"
          reverse={false}
          duration={1.2}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={0.96}
          threshold={0.12}
          delay={0}
        >
          <ProjectsSection />
        </AnimatedContent>

        {/* ── FOOTER ────────────────────────────────────────────────────────
            threshold={0.1}   → fires early — footers are short, we don't
                                want to have to scroll past them to see them.
            direction="horizontal", reverse=true, distance=70
                              → reverse=true flips the offset to -70px,
                                so the footer slides in from the RIGHT.
                                This mirrors the About (from left) and creates
                                a satisfying left↔right symmetry on the page.
            scale={1}         → no scale change, footer is a calm landing.
            ease="power2.out" → softest ease on the page, deliberate winding-down.
        */}
        <AnimatedContent
          distance={70}
          direction="vertical"
          reverse={true}
          duration={0.9}
          ease="power2.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.1}
          delay={0}
        >
          <Footer />
        </AnimatedContent>

      </div>
    </main>
  );
}
