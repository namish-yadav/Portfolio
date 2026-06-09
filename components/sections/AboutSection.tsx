'use client';

import Image from "next/image";
import { Code2, Database, Globe, Server } from "lucide-react";

const skills = [
  { name: "Frontend", icon: Globe, items: ["HTML", "CSS", "JavaScript"] },
  { name: "Backend", icon: Server, items: ["Java", "Python", "Node.js"] },
  { name: "Database", icon: Database, items: ["SQL"] },
  { name: "Tools", icon: Code2, items: ["Git", "VS Code", "Docker"] },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">About Me</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#e945f5]/50 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Photo & Info */}
          <div className="flex flex-col items-center lg:items-start gap-8">
            {/* Profile Photo */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#e945f5] to-[#8400ff] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-[#e945f5]/30">
                <Image
                  src="/pfp.jpg"
                  alt="Namish - Profile Photo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Quick Info */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Namish Yadav</h3>
              <p className="text-[#e945f5] font-medium mb-4">Front End Developer</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300">
                  Open to Opportunities
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300">
                  Remote Friendly
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col gap-8">
            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Background</h3>
              <p className="text-neutral-400 leading-relaxed">
                I am a technologist passionate about engineering elegant, interactive software applications. 
                With a strong foundation in both frontend and backend technologies, I strive to create 
                solutions that are not only functional but also visually appealing and user-friendly.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                My journey in software development started with curiosity about how things work, 
                which evolved into a deep passion for building applications that solve real-world problems.
                I am constantly learning and exploring new technologies to stay at the forefront of innovation.
              </p>
            </div>

            {/* Skills Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Skills & Technologies</h3>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((category) => (
                  <div 
                    key={category.name}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#e945f5]/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <category.icon className="w-4 h-4 text-[#e945f5]" />
                      <span className="font-medium text-white text-sm">{category.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {category.items.map((item) => (
                        <span 
                          key={item}
                          className="px-2 py-0.5 rounded text-xs bg-[#e945f5]/10 text-neutral-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Goals */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Career Goals</h3>
              <p className="text-neutral-400 leading-relaxed">
                I aim to contribute to innovative projects that push the boundaries of technology, 
                collaborate with talented teams, and continue growing as a developer while making 
                meaningful impacts through code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
