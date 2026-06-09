'use client';

import BlurText from "@/components/BlurText";
import RotatingText from "@/components/RotatingText";
import TrueFocus from "@/components/TrueFocus";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20">
        <div className="flex flex-col gap-6">
          <BlurText 
            text="Hello world, my name is" 
            delay={150} 
            animateBy="words" 
            direction="top" 
            className="text-lg tracking-widest uppercase font-semibold"
            stepDuration={0.4}
          />
          
          {/* TrueFocus replaces the static h1 */}
          <div className="text-6xl md:text-8xl font-black tracking-tight text-white leading-none">
            <TrueFocus
              sentence="Namish Yadav"
              manualMode={true}
              blurAmount={6}
              borderColor="#00ff26"
              glowColor="rgba(12, 169, 38, 0.5)"
              animationDuration={0.5}
              pauseBetweenAnimations={1.5}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-2xl md:text-3xl font-bold text-neutral-300">
            <span>I build solutions using</span>
            <RotatingText
              texts={['Java', 'Python', 'SQL', 'HTML', 'CSS', 'JavaScript']}
              mainClassName="px-4 py-1 bg-white text-black rounded-lg overflow-hidden font-bold"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              rotationInterval={2500}
              splitBy="characters"
              auto
              loop
            />
          </div>

          <p className="text-neutral-400 text-lg max-w-xl mt-4 leading-relaxed">
            A passionate developer focused on building elegant, interactive software applications. 
            Move your cursor to interact with the vector fields behind this text.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <a 
              href="https://github.com/namish-yadav" 
              target="_blank" rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-[#e945f5]/20 border border-white/10 hover:border-[#e945f5]/50 transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://linkedin.com/in/namish-yadav" 
              target="_blank" rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-[#e945f5]/20 border border-white/10 hover:border-[#e945f5]/50 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://instagram.com/namishyadv" 
              target="_blank" rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-[#e945f5]/20 border border-white/10 hover:border-[#e945f5]/50 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a 
              href="mailto:nam4sh@gmail.com"
              className="p-3 rounded-full bg-white/10 hover:bg-[#e945f5]/20 border border-white/10 hover:border-[#e945f5]/50 transition-all duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500">
          <span className="text-sm tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-neutral-500 to-transparent" />
        </div>
      </div>
    </section>
  );
}