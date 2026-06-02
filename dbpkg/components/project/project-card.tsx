/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight, X } from "lucide-react";
import {
  ExpandableScreen,
  ExpandableScreenTrigger,
  ExpandableScreenContent,
} from "@/components/ui/expandable-screen";
import { ProjectDetailsContent } from "@/components/project/project-detail-content";

interface ProjectCardProps {
  project: any;
  layoutId: string;
  locale: "en" | "id";
  t: any;
  getIconForType: (type: string) => React.ReactNode;
}

export function ProjectCard({
  project,
  layoutId,
  locale,
  t,
  getIconForType,
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    const handlePopState = () => {
      setIsExpanded(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleExpandChange = (nextExpanded: boolean) => {
    setIsExpanded(nextExpanded);

    if (nextExpanded) {
      window.history.pushState(
        { isModal: true },
        "",
        `/${locale}${project.detailsUrl}`,
      );
    } else {
      const currentPath = window.location.pathname;
      const expectedModalPath = `/${locale}${project.detailsUrl}`;

      if (currentPath === expectedModalPath) {
        if (window.history.state?.isModal) {
          window.history.back();
        } else {
          window.history.pushState({}, "", `/${locale}`);
        }
      }
    }
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col justify-between border border-border bg-background shadow-sm p-6 sm:p-8 rounded hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase tracking-wider rounded flex items-center gap-1.5">
            {getIconForType(project.type)}
            <span className="font-semibold dark:text-zinc-300">
              {project.type}
            </span>
          </span>
        </div>
        <h4 className="font-display font-medium text-xl tracking-tight uppercase">
          {project.title}
        </h4>
        <p className="font-sans text-sm text-muted-foreground mt-3 leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tech.map((techItem: string, ti: number) => (
            <span
              key={ti}
              className="px-2 py-0.5 bg-background border border-zinc-200 dark:border-zinc-600 shadow-sm text-zinc-600 dark:text-zinc-300 text-[10px] font-mono rounded"
            >
              {techItem}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-4">
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

          {project.detailsUrl && (
            <ExpandableScreen
              layoutId={layoutId}
              expanded={isExpanded}
              onExpandChange={handleExpandChange}
              triggerRadius="4px"
              contentRadius="12px"
            >
              <ExpandableScreenTrigger>
                <button className="inline-flex items-center text-xs text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded font-display font-medium gap-1 transition-colors group/details cursor-pointer">
                  <span>{t.viewDetails}</span>
                  <ArrowRight
                    size={13}
                    className="transform group-hover/details:translate-x-0.5 transition-transform"
                  />
                </button>
              </ExpandableScreenTrigger>
              <ExpandableScreenContent className="fixed inset-0 z-50 bg-background text-foreground overflow-y-auto  p-6 sm:p-12 sm:pt-0 w-full h-full border border-zinc-200 dark:border-zinc-800">
                <ProjectDetailsContent
                  project={project}
                  locale={locale}
                  t={t}
                  onClose={() => handleExpandChange(false)}
                />
              </ExpandableScreenContent>
            </ExpandableScreen>
          )}
        </div>
      </div>
    </motion.div>
  );
}
