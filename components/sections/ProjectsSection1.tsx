'use client';

import { useEffect, useState } from "react";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
}

const languageColors: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  default: "#e945f5",
};

export default function ProjectsSection() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/users/namish-yadav/repos?sort=updated&per_page=12")
      .then((res) => res.json())
      .then((data: Repo[]) => {
        const ownRepos = data.filter((r) => !r.fork).slice(0, 6);
        setRepos(ownRepos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white">
            Projects<span className="text-[#e945f5]">.</span>
          </h2>
          <p className="text-neutral-400 mt-4 text-lg">
            Auto-synced from GitHub. Push a repo and it appears here automatically.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && repos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#e945f5]/50 hover:bg-white/10 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-bold text-lg capitalize group-hover:text-[#e945f5] transition-colors leading-tight">
                      {repo.name.replace(/-/g, " ")}
                    </h3>
                    {repo.homepage && (
                      
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 ml-3 text-xs px-3 py-1 rounded-full bg-[#e945f5]/20 text-[#e945f5] border border-[#e945f5]/30 hover:bg-[#e945f5]/40 transition-all"
                      >
                        Live
                      </a>
                    )}
                  </div>

                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                    {repo.description ?? "No description provided."}
                  </p>

                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-6 text-neutral-500 text-xs">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            languageColors[repo.language] ?? languageColors.default,
                        }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span>{repo.stargazers_count} stars</span>
                  <span>{repo.forks_count} forks</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && repos.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-lg">No public repositories found.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          
            href="https://github.com/namish-yadav"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 text-white hover:border-[#e945f5] hover:text-[#e945f5] transition-all duration-300"
          >
            View all on GitHub
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}