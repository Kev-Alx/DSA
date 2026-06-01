"use client";
import { useState } from "react";
import { Copy, Check, Mail, ExternalLink } from "lucide-react";
import { Github, LinkedinIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { translations } from "@/constants/translations";

export const portfolioOwner = {
  name: "Kevin Alexander",
  email: "kevinalxdr@gmail.com",
  linkedIn: "https://www.linkedin.com/in/kevin-alexander-333ba8310",
  github: "https://github.com/Kev-Alx",
};

interface ContactProps {
  locale: "en" | "id";
}

export default function Contact({ locale }: ContactProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[locale].contact;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioOwner.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-transparent pt-24" id="contact">
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 gap-12">
          <div className="border-b border-border pb-6">
            <h3 className="font-display font-medium text-3xl md:text-4xl tracking-tight mt-1">
              {t.heading}
            </h3>
          </div>

          <div className="flex flex-col gap-4" id="communication-actions">
            <div className="bg-background border border-border rounded p-5 flex flex-col justify-between  transition-all shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 border border-border bg-neutral-100 dark:bg-neutral-800 rounded flex-shrink-0">
                    <Mail size={16} className="text-muted-foreground" />
                  </div>
                  <span className="font-mono text-sm break-all font-medium">
                    {portfolioOwner.email}
                  </span>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded border border-border dark:hover:text-neutral-300 dark:hover:bg-neutral-600 hover:text-zinc-900 transition-all flex-shrink-0 cursor-pointer active:scale-95 shadow-sm sm:w-auto w-full flex justify-center items-center gap-2"
                  title="Copy email to clipboard"
                  id="btn-copy-email"
                >
                  {copied ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>

            <a
              href={portfolioOwner.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background border border-border rounded p-5 flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 border border-border bg-neutral-100 dark:bg-neutral-800 rounded flex-shrink-0">
                  <HugeiconsIcon
                    icon={LinkedinIcon}
                    size={16}
                    strokeWidth={1.8}
                    className="text-muted-foreground"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-medium  mt-0.5">
                    {t.linkedin}
                  </span>
                </div>
              </div>
              <ExternalLink
                size={14}
                className="text-muted-foreground group-hover:text-foreground transition-colors mr-1"
              />
            </a>

            <a
              href={portfolioOwner.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background border border-border rounded p-5 flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 border border-border bg-neutral-100 dark:bg-neutral-800 rounded flex-shrink-0">
                  <HugeiconsIcon
                    icon={Github}
                    size={16}
                    strokeWidth={1.8}
                    className="text-muted-foreground"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-medium  mt-0.5">
                    {t.github}
                  </span>
                </div>
              </div>
              <ExternalLink
                size={14}
                className="text-muted-foreground group-hover:text-foreground transition-colors mr-1"
              />
            </a>
          </div>
        </div>
      </section>

      <footer className="max-w-2xl mx-auto w-full pb-12" id="footer">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="font-display font-medium text-xs tracking-widest text-muted-foreground block uppercase">
              {portfolioOwner.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-muted-foreground">
              © {currentYear}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
