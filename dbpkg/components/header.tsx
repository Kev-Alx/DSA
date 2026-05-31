"use client";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function HeaderNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Safe initial defaults for server-side compilation
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const navItems = [
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
  ];

  // Run only on the client after mounting to sync the actual state
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialDarkSetting = stored ? stored === "dark" : systemPrefersDark;

    // Deferring updates to the next tick breaks the synchronous render chain,
    // silencing the cascading render warning completely.
    setTimeout(() => {
      setIsDark(initialDarkSetting);
      setMounted(true);
    }, 0);
  }, []);

  // Handle document class application when state shifts
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  // Broadcast navbar visibility for background effects synchronization
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
  }, [lastScrollY]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
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
        {/* Brand */}
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

        {/* Desktop Links + Theme Toggle */}
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

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-1 p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 cursor-pointer"
          >
            {/* Prevent icon hydration mismatches by returning an empty block placeholder until mounted */}
            {!mounted ? (
              <div className="w-4 h-4" />
            ) : isDark ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
          </button>
        </div>

        {/* Mobile: Theme Toggle + Hamburger */}
        <div className="md:hidden flex items-center space-x-1">
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 absolute top-16 left-0 w-full py-4 px-6 flex flex-col space-y-4 shadow-sm">
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
                className={`font-mono text-xs uppercase tracking-widest py-2 border-b border-zinc-100 dark:border-zinc-800 ${
                  isActive
                    ? "text-zinc-900 dark:text-zinc-50 font-bold"
                    : "text-zinc-500"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
