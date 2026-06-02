/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Globe, Code, Layers } from "lucide-react";
import { staticLinks } from "@/constants/projects";

interface WebProjectLayoutProps {
  project: any;
  t: any;
}

export function WebProjectLayout({ project, t }: WebProjectLayoutProps) {
  const matchedProject = staticLinks.find((link) => {
    if (!link.detailsUrl || !project.detailsUrl) return false;
    return (
      link.detailsUrl === project.detailsUrl ||
      link.detailsUrl.endsWith(project.detailsUrl)
    );
  });

  const images = matchedProject?.images || [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid w-full grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5 space-y-8 sticky top-24">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase tracking-wider rounded flex items-center gap-1.5">
                <Code size={12} />
                {project.type}
              </span>
            </div>
            <h2 className="text-3xl font-display font-medium uppercase tracking-tight text-foreground">
              {project.title}
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed font-sans">
              {project.description}
            </p>
          </div>

          {project.tech && project.tech.length > 0 && (
            <div className="border-t border-border pt-6">
              <h5 className="text-xs font-mono text-muted-foreground uppercase mb-3 flex items-center gap-1.5">
                <Layers size={12} />
                {t.techStackHeading || "Technologies Used"}
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((techItem: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-background border border-border text-foreground text-xs font-mono rounded shadow-sm"
                  >
                    {techItem}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-7 space-y-6 w-full">
          {images.length > 0 ? (
            images.map((src: string, idx: number) => (
              <div
                key={idx}
                className="overflow-hidden rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm"
              >
                <img
                  src={src}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="w-full h-auto object-cover transform-gpu will-change-transform"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded text-center text-muted-foreground bg-zinc-50 dark:bg-zinc-900/50">
              <Globe size={24} className="mb-2 stroke-[1.5]" />
              <p className="text-xs font-mono">
                {t.noImagesAvailable ||
                  "No preview interfaces mapped for this entry"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
