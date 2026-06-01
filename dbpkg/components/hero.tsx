"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, TrendingUp, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { translations } from "@/constants/translations";

type RoleType = "scientist" | "analyst" | "engineer";

interface HeroSectionProps {
  locale: "en" | "id";
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const [activeRole, setActiveRole] = useState<RoleType>("scientist");
  const [isHovered, setIsHovered] = useState(false);

  const t = translations[locale].hero;

  const roleConfigs = {
    scientist: {
      icon: <Brain className="w-5 h-5 text-neutral-500" />,
      values: [95, 88, 82, 100],
    },
    analyst: {
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      values: [90, 94, 85, 100],
    },
    engineer: {
      icon: <Cpu className="w-5 h-5 text-amber-500" />,
      values: [92, 88, 80, 100],
    },
  };

  const currentRoleData = t.roles[activeRole];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-12 text-left pt-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl sm:text-4xl font-bold tracking-tight font-display leading-tight text-zinc-900 dark:text-zinc-50">
          <span className="inline-flex flex-wrap gap-x-2 gap-y-1 mt-2 sm:mt-0">
            {(["scientist", "analyst", "engineer"] as RoleType[]).map(
              (role) => {
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`relative px-2 py-0.5 font-display capitalize transition-all duration-300 rounded cursor-pointer ${
                      isActive
                        ? "text-zinc-900 dark:text-zinc-50 font-bold"
                        : "text-zinc-400 font-medium hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                    }`}
                  >
                    <motion.span
                      animate={
                        !isActive
                          ? {
                              opacity: [0.6, 1, 0.6],
                              filter: [
                                "drop-shadow(0 0 0px rgba(161,161,170,0))",
                                "drop-shadow(0 0 4px rgba(161,161,170,0.5))",
                                "drop-shadow(0 0 0px rgba(161,161,170,0))",
                              ],
                            }
                          : {
                              opacity: 1,
                              filter: "drop-shadow(0 0 0px rgba(0,0,0,0))",
                            }
                      }
                      transition={
                        !isActive
                          ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                          : undefined
                      }
                      className={cn(
                        "relative z-10 block",
                        role === "scientist" && "-ml-2.5",
                      )}
                    >
                      {role === "scientist" && "Data Scientist"}
                      {role === "analyst" &&
                        (locale === "id" ? "Analis" : "Analyst")}
                      {role === "engineer" && "&& Engineer"}
                    </motion.span>

                    {isActive && (
                      <motion.span
                        layoutId="hero-pill"
                        className="absolute inset-0 bg-zinc-50 dark:bg-zinc-800 rounded-md z-0"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              },
            )}
          </span>
        </h1>

        <div className="h-12 mt-2">
          <p className="max-w-xl text-base font-sans leading-relaxed">
            {t.greeting}
          </p>
        </div>
      </div>

      <motion.div
        layout="position"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full bg-neutral-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden backdrop-blur-sm transition-colors duration-300"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            {roleConfigs[activeRole].icon}
            <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
              {t.breakdown} {activeRole}
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
        </div>

        <div className="h-12 mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeRole}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-sans text-zinc-600 dark:text-zinc-400 leading-relaxed"
            >
              {currentRoleData.summary}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-4">
          {currentRoleData.metrics.map((label, idx) => {
            const percentageValue = roleConfigs[activeRole].values[idx];
            return (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {label}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                    {percentageValue}%
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentageValue}%` }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      delay: idx * 0.05,
                    }}
                    className={`h-full rounded-full ${
                      activeRole === "scientist"
                        ? "bg-neutral-800 dark:bg-neutral-400"
                        : activeRole === "analyst"
                          ? "bg-emerald-500 dark:bg-emerald-400"
                          : "bg-amber-500 dark:bg-amber-400"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={
            isHovered
              ? { height: "auto", opacity: 1, marginTop: "1rem" }
              : { height: 0, opacity: 0, marginTop: "0rem" }
          }
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 font-mono text-[10px] text-muted-foreground tracking-tight leading-relaxed">
            {t.disclosure}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
