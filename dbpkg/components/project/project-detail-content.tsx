/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataProjectLayout } from "@/components/project/data-project-layout";
import { ArrowLeft, ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { WebProjectLayout } from "@/components/project/web-project-layout";
import { cn } from "@/lib/utils";

interface ProjectDetailsContentProps {
  project: any;
  locale: "en" | "id";
  t: any;
  onClose?: () => void;
  isStandalone?: boolean;
}

export function ProjectDetailsContent({
  project,
  locale,
  t,
  onClose,
  isStandalone = false,
}: ProjectDetailsContentProps) {
  const isDataProject =
    project.type.toLowerCase().includes("data") ||
    project.type.toLowerCase().includes("economic");

  return (
    <div className="w-full h-full relative text-foreground">
      <div className="w-full">
        <div
          className={cn(
            "sticky top-0 z-40 bg-background flex justify-between items-center py-4 max-w-6xl mx-auto px-4 mb-6",
            !isStandalone && "pt-12",
          )}
        >
          {isStandalone ? (
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> {t.backToPortfolio}
            </Link>
          ) : (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X size={14} /> {t.closeProject}
            </button>
          )}
          <div className="flex gap-2 items-center">
            {project.links?.github && project.links.github !== "#" && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-300 font-mono gap-1 transition-colors group/link"
              >
                <span>{t.repository}</span>
                <ArrowUpRight
                  size={13}
                  className="transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                />
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-300 font-mono gap-1 transition-colors group/link"
              >
                <span>{t.liveDemo}</span>
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>
        {isDataProject ? (
          <DataProjectLayout markdownContent={project.markdownContent || ""} />
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col min-h-full justify-between p-4">
            <WebProjectLayout project={project} t={t} />
          </div>
        )}
      </div>
    </div>
  );
}
