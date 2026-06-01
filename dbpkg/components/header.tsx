// src/components/header.tsx
"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation"; // [!code highlight]
import { Sun, Moon } from "lucide-react";
import { navLabels } from "@/constants/translations";

interface HeaderNavProps {
  locale: "en" | "id";
}

export default function HeaderNav({ locale }: HeaderNavProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current page path URL // [!code +]
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const navItems = useMemo(() => {
    const t = navLabels[locale];
    return [
      { label: t.experience, href: "#experience" },
      { label: t.education, href: "#education" },
      { label: t.projects, href: "#projects" },
      { label: t.contact, href: "#contact" },
    ];
  }, [locale]);

  // Route-based language switch
  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "id" : "en"; // [!code +]

    // Safely replaces the /[locale] segment at the front of your current route path
    const fragments = pathname.split("/"); // [!code +]
    fragments[1] = nextLocale; // [!code +]
    const targetPath = fragments.join("/"); // [!code +]

    router.push(targetPath); // Hard nav jump to static path // [!code +]
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialDarkSetting = stored ? stored === "dark" : systemPrefersDark;

    setTimeout(() => {
      setIsDark(initialDarkSetting);
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("navbar-visibility", { detail: { isVisible } }),
    );
  }, [isVisible]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      const sections = navItems.map((item) =>
        document.getElementById(item.href.replace("#", "")),
      );
      const scrollPosition = currentScrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].href);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, navItems]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.replace("#", ""));
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 z-40 w-full backdrop-blur-md transition-transform duration-300 
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]
        [-webkit-mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]`}
      id="header-nav"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#hero");
            }}
            className="font-display font-bold tracking-tight text-lg text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity"
          >
            kev-alx
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className={`lowercase transition-colors duration-200 relative py-1 ${
                    isActive
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-900 dark:bg-zinc-50" />
                  )}
                </a>
              );
            })}
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
          >
            {!mounted ? (
              <div className="w-4 h-4" />
            ) : isDark ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
          </button>

          <button
            onClick={toggleLanguage}
            className="text-xs font-mono flex items-center space-x-1 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
            aria-label="Switch Language"
          >
            <span
              className={
                locale === "en"
                  ? "text-zinc-900 dark:text-zinc-50 font-bold"
                  : "text-zinc-400"
              }
            >
              EN
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span
              className={
                locale === "id"
                  ? "text-zinc-900 dark:text-zinc-50 font-bold"
                  : "text-zinc-400"
              }
            >
              ID
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
