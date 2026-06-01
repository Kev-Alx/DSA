"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowRight, BarChart3, Code, Globe } from "lucide-react";
import { translations } from "@/constants/translations";

interface ProjectsProps {
  locale: "en" | "id";
}

export default function ProjectsGrid({ locale }: ProjectsProps) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "DATA" | "WEB">("ALL");

  const t = translations[locale].projects;

  const staticLinks = [
    {
      github: "https://github.com/Kev-Alx/DSA/tree/master/sales",
      demo: "https://public.tableau.com/app/profile/kevin.alexander4206/viz/ElectronicStoreeCommerceDashboard/Dashboard1",
      detailsUrl: "/projects/electronic-store-ecommerce",
    },
    {
      github: "https://github.com/Kev-Alx/DSA/tree/master/acc-ugc",
      detailsUrl: "/projects/accommodation-analysis",
    },
    {
      github: "https://github.com/example/global-trade-war-analysis",
      detailsUrl: "/projects/global-trade-war-analysis",
    },
    {
      github: "#",
      demo: "https://utilsortools.vercel.app/",
      detailsUrl: "/projects/utils-or-tools",
    },
    { detailsUrl: "/projects/index-campus-event" },
    {
      demo: "https://simplestchart.vercel.app/",
      detailsUrl: "/projects/simple-chart",
    },
  ];

  const derivedProjects = t.items.map((item, idx) => ({
    ...item,
    links: staticLinks[idx],
    detailsUrl: staticLinks[idx].detailsUrl,
  }));

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

  const getHeadingText = () => {
    if (!isFilteredMode) return t.featuredHeading;
    return filter === "DATA" ? t.analyticsHeading : t.webDevHeading;
  };

  return (
    <section
      className="py-24 bg-transparent max-w-2xl mx-auto px-4 sm:px-6"
      id="projects"
    >
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-zinc-200 dark:border-zinc-700 pb-6 mb-12">
          <div>
            <h3 className="font-display font-medium text-3xl md:text-4xl tracking-tight mt-1">
              {getHeadingText()}
            </h3>
          </div>

          <div
            className="mt-6 md:mt-0 flex bg-background border border-zinc-200 dark:border-zinc-700 rounded p-1"
            id="project-filters"
          >
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 font-mono text-xs rounded transition-all cursor-pointer ${
                filter === "ALL"
                  ? "dark:bg-zinc-700 font-semibold shadow-sm border border-zinc-200 dark:border-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400 border border-transparent"
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setFilter("DATA")}
              className={`px-3 py-1.5 font-mono text-xs rounded transition-all cursor-pointer ${
                filter === "DATA"
                  ? "dark:bg-zinc-700 font-semibold shadow-sm border border-zinc-200 dark:border-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400 border border-transparent"
              }`}
            >
              {t.filterAnalytics}
            </button>
            <button
              onClick={() => setFilter("WEB")}
              className={`px-3 py-1.5 font-mono text-xs rounded transition-all cursor-pointer ${
                filter === "WEB"
                  ? "dark:bg-zinc-700 font-semibold shadow-sm border border-zinc-200 dark:border-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400 border border-transparent"
              }`}
            >
              {t.filterWebDev}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8" id="featured-projects-grid">
          {visibleFeatured.map((p) => (
            <motion.div
              key={p.id}
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
                    {getIconForType(p.type)}
                    <span className="font-semibold dark:text-zinc-300">
                      {p.type}
                    </span>
                  </span>
                </div>
                <h4 className="font-display font-medium text-xl tracking-tight uppercase">
                  {p.title}
                </h4>
                <p className="font-sans text-sm text-muted-foreground mt-3 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-8">
                <div
                  className="flex flex-wrap gap-1.5 mb-6"
                  id={`tech-${p.id}`}
                >
                  {p.tech.map((techItem, ti) => (
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
                    {p.links?.github && p.links.github !== "#" && (
                      <a
                        href={p.links.github}
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
                    {p.links?.demo && (
                      <a
                        href={p.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-300 font-mono gap-1 transition-colors group/link"
                      >
                        <span>{t.liveDemo}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                  {p.detailsUrl && (
                    <a
                      href={p.detailsUrl}
                      className="inline-flex items-center text-xs text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded font-display font-medium gap-1 transition-colors group/details"
                    >
                      <span>{t.viewDetails}</span>
                      <ArrowRight
                        size={13}
                        className="transform group-hover/details:translate-x-0.5 transition-transform"
                      />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
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
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="group flex flex-col justify-between border border-border dark:hover:border-zinc-600 bg-background shadow-sm p-6 sm:p-8 rounded hover:border-zinc-300 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase tracking-wider rounded flex items-center gap-1.5">
                            {getIconForType(p.type)}
                            <span className="font-semibold">{p.type}</span>
                          </span>
                        </div>
                        <h4 className="font-display font-medium text-xl tracking-tight uppercase">
                          {p.title}
                        </h4>
                        <p className="font-sans text-sm text-muted-foreground mt-3 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      <div className="mt-8">
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {p.tech.map((techItem, ti) => (
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
                            {p.links?.github && p.links.github !== "#" && (
                              <a
                                href={p.links.github}
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
                            {p.links?.demo && (
                              <a
                                href={p.links.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-300 font-mono gap-1 transition-colors group/link"
                              >
                                <span>{t.liveDemo}</span>
                                <ArrowUpRight size={13} />
                              </a>
                            )}
                          </div>
                          {p.detailsUrl && (
                            <a
                              href={p.detailsUrl}
                              className="inline-flex items-center text-xs text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded font-display font-medium gap-1 transition-colors group/details"
                            >
                              <span>{t.viewDetails}</span>
                              <ArrowRight
                                size={13}
                                className="transform group-hover/details:translate-x-0.5 transition-transform"
                              />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
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
