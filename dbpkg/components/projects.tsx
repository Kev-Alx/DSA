"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  BarChart3,
  Database,
  Code,
  Globe,
} from "lucide-react";

export const projects = [
  {
    id: "proj1",
    title: "Global Sales & Revenue Forecasting Model",
    type: "Data Analytics",
    featured: true,
    description:
      "An advanced business intelligence dashboard and statistical engine that analyzes corporate historical sales and implements time-series forecasting models to project future monthly revenues.",
    tech: ["Python", "SQL", "Tableau", "Prophet", "Pandas", "PostgreSQL"],
    links: {
      github: "https://github.com/example/sales-forecasting",
      demo: "#",
    },
    detailsUrl: "/projects/sales-forecasting", // Optional View Details page URL
  },
  {
    id: "proj2",
    title: "Customer Lifetime Value (CLV) Segmentation",
    type: "Data Science",
    featured: true,
    description:
      "An end-to-end data science project utilizing RFM (Recency, Frequency, Monetary) modeling and unsupervised machine learning (K-Means Clustering) to categorize online customers into distinct marketing value tiers.",
    tech: [
      "Python",
      "Scikit-Learn",
      "Matplotlib",
      "Seaborn",
      "PostgreSQL",
      "Jupyter",
    ],
    links: {
      github: "https://github.com/example/clv-segmentation",
      demo: "#",
    },
    // detailsUrl omitted to show optional handling
  },
  {
    id: "proj3",
    title: "Enterprise BI Platform & Metrics Server",
    type: "Hybrid",
    featured: true,
    description:
      "A secure web portal featuring custom high-performance data visualizations built using D3.js and a fast React frontend. It serves live interactive widgets connected to a Postgres warehouse, enabling non-technical operators to run safe queries.",
    tech: [
      "React",
      "TypeScript",
      "D3.js",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS",
    ],
    links: {
      github: "https://github.com/example/bi-portal",
      demo: "#",
    },
    detailsUrl: "/projects/bi-platform",
  },
  {
    id: "proj4",
    title: "Predictive Warehouse Demand System",
    type: "Data Science",
    featured: true,
    description:
      "A machine learning predictive model assessing warehouse unit demand using regression models and light gradient-boosted trees. Enables inventory teams to prevent over-stocking and under-stocking cycles.",
    tech: ["Python", "XGBoost", "Pandas", "Scikit-Learn", "FastAPI", "SQL"],
    links: {
      github: "https://github.com/example/warehouse-demand",
    },
    detailsUrl: "/projects/warehouse-demand",
  },
  {
    id: "proj5",
    title: "Interactive Looker Analytics",
    type: "Data Analytics",
    featured: false,
    description:
      "A multi-source analytical looker portal linking Google Analytics, Shopify, and AdWords API pipelines into unified performance reporting views, analyzing attribution pathways.",
    tech: ["Looker Studio", "BigQuery", "SQL", "Google Analytics", "Python"],
    // links completely omitted to show optional handling
    detailsUrl: "/projects/looker-analytics",
  },
  {
    id: "proj6",
    title: "Air Quality Forecasting Engine",
    type: "Data Science",
    featured: false,
    description:
      "An environmental research model predicting particulate index values using statistical regressions to project safe outdoor parameters for major metropolitan centers.",
    tech: ["R", "ggplot2", "Time-Series", "ARIMA", "Shiny"],
    links: {
      github: "https://github.com/example/environment-arima",
    },
  },
  {
    id: "proj7",
    title: "Custom Interactive SQL Scratchpad",
    type: "Web Development",
    featured: false,
    description:
      "A web interface built for internal database trainees to safely experiment with querying visual SQLite tables, displaying syntax errors, table outputs, and interactive schema hints.",
    tech: ["React", "SQL.js", "Tailwind CSS", "TypeScript", "Vite"],
    links: {
      github: "https://github.com/example/sql-scratchpad",
      demo: "#",
    },
  },
];

export default function ProjectsGrid() {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "DATA" | "WEB">("ALL");

  const featuredProjects = projects.filter((p) => p.featured);
  const extraProjects = projects.filter((p) => !p.featured);

  const getFilteredProjects = (projectList: typeof projects) => {
    if (filter === "ALL") return projectList;
    if (filter === "DATA") {
      return projectList.filter(
        (p) =>
          p.type === "Data Analytics" ||
          p.type === "Data Science" ||
          p.type === "Hybrid",
      );
    }
    if (filter === "WEB") {
      return projectList.filter(
        (p) => p.type === "Web Development" || p.type === "Hybrid",
      );
    }
    return projectList;
  };

  const visibleFeatured = getFilteredProjects(featuredProjects);
  const visibleExtra = getFilteredProjects(extraProjects);

  const getIconForType = (type: string) => {
    switch (type) {
      case "Data Analytics":
        return <BarChart3 size={15} className="text-zinc-600" />;
      case "Data Science":
        return <Database size={15} className="text-zinc-600" />;
      case "Web Development":
        return <Code size={15} className="text-zinc-600" />;
      default:
        return <Globe size={15} className="text-zinc-600" />;
    }
  };

  return (
    <section
      className="py-24 border-t border-zinc-100 bg-transparent text-zinc-900 max-w-2xl mx-auto px-4 sm:px-6"
      id="projects"
    >
      <div className="w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-zinc-200 pb-6 mb-12">
          <div>
            <h3 className="font-display font-medium text-3xl md:text-4xl text-zinc-900 tracking-tight mt-1">
              Featured Projects
            </h3>
          </div>

          {/* Segment Filter */}
          <div
            className="mt-6 md:mt-0 flex bg-zinc-50 border border-zinc-200 rounded p-1"
            id="project-filters"
          >
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 font-mono text-xs rounded transition-all cursor-pointer ${
                filter === "ALL"
                  ? "bg-white text-zinc-900 font-semibold shadow-sm border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-900 border border-transparent"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("DATA")}
              className={`px-3 py-1.5 font-mono text-xs rounded transition-all cursor-pointer ${
                filter === "DATA"
                  ? "bg-white text-zinc-900 font-semibold shadow-sm border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-900 border border-transparent"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setFilter("WEB")}
              className={`px-3 py-1.5 font-mono text-xs rounded transition-all cursor-pointer ${
                filter === "WEB"
                  ? "bg-white text-zinc-900 font-semibold shadow-sm border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-900 border border-transparent"
              }`}
            >
              Web Dev
            </button>
          </div>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 gap-8" id="featured-projects-grid">
          {visibleFeatured.map((p) => (
            <motion.div
              key={p.id}
              layout="position"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="group flex flex-col justify-between border border-zinc-200 bg-white shadow-sm p-6 sm:p-8 rounded hover:border-zinc-300 transition-all duration-300 relative"
            >
              <div>
                {/* Project Badge Row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-700 font-mono text-[10px] uppercase tracking-wider rounded flex items-center gap-1.5">
                    {getIconForType(p.type)}
                    <span className="font-semibold">{p.type}</span>
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
                    FOCUSED INSTANCE
                  </span>
                </div>

                {/* Project Title */}
                <h4 className="font-display font-medium text-xl text-zinc-900 tracking-tight uppercase transition-colors">
                  {p.title}
                </h4>

                {/* Short Description */}
                <p className="font-sans text-sm text-zinc-600 mt-3 leading-relaxed">
                  {p.description}
                </p>
              </div>

              {/* Technologies & Trigger Links */}
              <div className="mt-8">
                {/* Tech Pills */}
                <div
                  className="flex flex-wrap gap-1.5 mb-6"
                  id={`tech-${p.id}`}
                >
                  {p.tech.map((t, ti) => (
                    <span
                      key={ti}
                      className="px-2 py-0.5 bg-white border border-zinc-200 shadow-sm text-zinc-600 text-[10px] font-mono rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Dynamic Links Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-4">
                  <div className="flex items-center gap-4">
                    {p.links?.github && (
                      <a
                        href={p.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-zinc-600 hover:text-zinc-900 font-mono gap-1 transition-colors group/link"
                      >
                        <span>Repository</span>
                        <ArrowUpRight
                          size={13}
                          className="transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                        />
                      </a>
                    )}

                    {p.links?.demo && (
                      <a
                        href={p.links.demo}
                        className="inline-flex items-center text-xs text-zinc-600 hover:text-zinc-900 font-mono gap-1 transition-colors group/link"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>

                  {/* Optional View Details Button */}
                  {p.detailsUrl && (
                    <a
                      href={p.detailsUrl}
                      className="inline-flex items-center text-xs text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded font-display font-medium gap-1 transition-colors group/details"
                    >
                      <span>View Details</span>
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

        {/* Expandable Additional Projects */}
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
                      className="group flex flex-col justify-between border border-zinc-200 bg-white shadow-sm p-6 sm:p-8 rounded hover:border-zinc-300 transition-all duration-300 relative"
                    >
                      <div>
                        {/* Project Badge Row */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-700 font-mono text-[10px] uppercase tracking-wider rounded flex items-center gap-1.5">
                            {getIconForType(p.type)}
                            <span className="font-semibold">{p.type}</span>
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
                            SUPPLEMENTARY DATA
                          </span>
                        </div>

                        {/* Project Title */}
                        <h4 className="font-display font-medium text-xl text-zinc-900 tracking-tight uppercase transition-colors">
                          {p.title}
                        </h4>

                        {/* Short Description */}
                        <p className="font-sans text-sm text-zinc-600 mt-3 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      {/* Tech & Action Links */}
                      <div className="mt-8">
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {p.tech.map((t, ti) => (
                            <span
                              key={ti}
                              className="px-2 py-0.5 bg-white border border-zinc-200 shadow-sm text-zinc-600 text-[10px] font-mono rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-4">
                          <div className="flex items-center gap-4">
                            {p.links?.github && (
                              <a
                                href={p.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-zinc-600 hover:text-zinc-900 font-mono gap-1 transition-colors group/link"
                              >
                                <span>Repository</span>
                                <ArrowUpRight
                                  size={13}
                                  className="transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                                />
                              </a>
                            )}

                            {p.links?.demo && (
                              <a
                                href={p.links.demo}
                                className="inline-flex items-center text-xs text-zinc-600 hover:text-zinc-900 font-mono gap-1 transition-colors group/link"
                              >
                                <span>Live Demo</span>
                                <ArrowUpRight size={13} />
                              </a>
                            )}
                          </div>

                          {/* Optional View Details Button */}
                          {p.detailsUrl && (
                            <a
                              href={p.detailsUrl}
                              className="inline-flex items-center text-xs text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded font-display font-medium gap-1 transition-colors group/details"
                            >
                              <span>View Details</span>
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

          {/* Load More Button Container */}
          <div className="mt-12 text-center" id="show-more-button-container">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-4 bg-white border border-zinc-300 text-zinc-900 font-mono text-xs uppercase tracking-widest rounded transition-all hover:bg-zinc-50 hover:border-zinc-400 active:scale-95 duration-200 cursor-pointer inline-flex items-center gap-2 shadow-sm"
              id="btn-show-more-projects"
            >
              {showAll
                ? "Collapse Case Studies"
                : "Show More Research & Projects"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
