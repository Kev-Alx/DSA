"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart3, Code, Globe } from "lucide-react";
import { translations } from "@/constants/translations";
import { ProjectCard } from "@/components/project/project-card";
import { staticLinks } from "@/constants/projects";

interface ProjectsProps {
  locale: "en" | "id";
  markdownData?: Record<string, string>;
}

export default function ProjectsGrid({
  locale,
  markdownData = {},
}: ProjectsProps) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "DATA" | "WEB">("ALL");

  const t = translations[locale].projects;

  const derivedProjects = t.items.map((item, idx) => {
    const links = staticLinks[idx];
    const slug = links.detailsUrl.split("/").pop() || "";
    return {
      ...item,
      links,
      detailsUrl: links.detailsUrl,
      markdownContent: markdownData[slug] || "",
    };
  });

  const getFilteredProjects = (list: typeof derivedProjects) => {
    if (filter === "ALL") return list;
    if (filter === "DATA") {
      return list.filter(
        (p) =>
          p.type.toLowerCase().includes("data") ||
          p.type.toLowerCase().includes("economic"),
      );
    }
    if (filter === "WEB") {
      return list.filter(
        (p) =>
          p.type.toLowerCase().includes("web") ||
          p.type.toLowerCase().includes("development"),
      );
    }
    return list;
  };

  const allFiltered = getFilteredProjects(derivedProjects);
  const isFilteredMode = filter !== "ALL";
  const visibleFeatured = isFilteredMode
    ? allFiltered
    : allFiltered.filter((p) => p.featured);
  const visibleExtra = isFilteredMode
    ? []
    : allFiltered.filter((p) => !p.featured);

  const getIconForType = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("data") || lowerType.includes("economic"))
      return (
        <BarChart3 size={15} className="text-zinc-600 dark:text-zinc-300" />
      );
    if (lowerType.includes("web") || lowerType.includes("development"))
      return <Code size={15} className="text-zinc-600 dark:text-zinc-300" />;
    return <Globe size={15} className="text-zinc-600 dark:text-zinc-300" />;
  };

  return (
    <section
      className="py-24 bg-transparent max-w-2xl mx-auto px-4 sm:px-6"
      id="projects"
    >
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-zinc-200 dark:border-zinc-700 pb-6 mb-12">
          <h3 className="font-display font-medium text-3xl md:text-4xl tracking-tight mt-1">
            {!isFilteredMode
              ? t.featuredHeading
              : filter === "DATA"
                ? t.analyticsHeading
                : t.webDevHeading}
          </h3>

          <div
            className="mt-6 md:mt-0 flex bg-background border border-zinc-200 dark:border-zinc-700 rounded p-1"
            id="project-filters"
          >
            {(["ALL", "DATA", "WEB"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1.5 font-mono text-xs rounded transition-all cursor-pointer ${
                  filter === mode
                    ? "dark:bg-zinc-700 font-semibold shadow-sm border border-zinc-200 dark:border-zinc-900"
                    : "text-zinc-600 dark:text-zinc-400 border border-transparent"
                }`}
              >
                {mode === "ALL"
                  ? t.filterAll
                  : mode === "DATA"
                    ? t.filterAnalytics
                    : t.filterWebDev}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8" id="featured-projects-grid">
          {visibleFeatured.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              layoutId={`featured-${p.id}`}
              locale={locale}
              t={t}
              getIconForType={getIconForType}
            />
          ))}
        </div>

        <div className="mt-8">
          <AnimatePresence>
            {showAll && visibleExtra.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
                id="collapsed-projects-section"
              >
                <div className="grid grid-cols-1 gap-8 pt-4">
                  {visibleExtra.map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      layoutId={`extra-${p.id}`}
                      locale={locale}
                      t={t}
                      getIconForType={getIconForType}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isFilteredMode && visibleExtra.length > 0 && (
            <div className="mt-12 text-center" id="show-more-button-container">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-4 bg-white border border-zinc-300 text-zinc-900 font-mono text-xs uppercase tracking-widest rounded transition-all hover:bg-zinc-50 hover:border-zinc-400 active:scale-95 duration-200 cursor-pointer inline-flex items-center gap-2 shadow-sm"
                id="btn-show-more-projects"
              >
                {showAll ? t.collapse : t.showMore}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
