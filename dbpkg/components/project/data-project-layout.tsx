/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Import KaTeX styles for beautiful math symbols rendering
import "katex/dist/katex.min.css";

interface DataProjectLayoutProps {
  markdownContent: string;
}
const normalizeLocalPath = (pathStr: string) => {
  return pathStr
    .trim()
    .replace(/^(\.\/|\.\\|\.)/, "") // Remove leading ./ or .\ or . if they exist
    .replace(/\\/g, "/") // Convert any Windows backslashes to forward slashes
    .replace(/^\/+/, ""); // Strip any remaining leading slashes to prevent duplicates
};
const preprocessMarkdown = (markdown: string) => {
  if (!markdown) return "";

  let updatedMarkdown = markdown.replace(
    /!\[(.*?)\]\(((?!https?:\/\/)[^)]+)\)/g,
    (_, alt, imgPath) => {
      return `![${alt}](/${normalizeLocalPath(imgPath)})`;
    },
  );

  updatedMarkdown = updatedMarkdown.replace(
    /<img\s+([^>]*?)src=["']((?!https?:\/\/)[^"']+)["']([^>]*?)>/g,
    (_, beforeSrc, srcPath, afterSrc) => {
      return `<img ${beforeSrc}src="/${normalizeLocalPath(srcPath)}"${afterSrc}>`;
    },
  );
  return updatedMarkdown
    .replace(/\r\n/g, "\n")
    .replace(/^-{3,}\s*$/gm, "────────────────────────────────────────")
    .replace(/^={3,}\s*$/gm, "────────────────────────────────────────");
};

export function DataProjectLayout({ markdownContent }: DataProjectLayoutProps) {
  const [headings, setHeadings] = useState<
    { level: number; text: string; id: string }[]
  >([]);
  const [activeId, setActiveId] = useState<string>("");

  // Memoize preprocessed markdown to prevent recalculating on every render cycle
  const processedMarkdown = useMemo(() => {
    // console.log(markdownContent);
    return preprocessMarkdown(markdownContent);
  }, [markdownContent]);

  useEffect(() => {
    if (!processedMarkdown) return;

    const lines = processedMarkdown.split("\n");
    const extractedHeadings = [];
    let inCodeBlock = false;

    for (const line of lines) {
      // Toggle code-block state
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      // Ignore anything inside code blocks
      if (inCodeBlock) continue;

      const match = line.match(/^(#{1,4})\s+(.*)$/);
      if (!match) continue;

      const level = match[1].length;
      const text = match[2].replace(/\[.*?\]\(.*?\)/g, "").trim();

      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      extractedHeadings.push({ level, text, id });
    }

    setHeadings(extractedHeadings);
  }, [processedMarkdown]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 items-start w-full max-w-6xl mx-auto px-4 py-6">
      {headings.length > 0 && (
        <aside className="w-full md:w-64 sticky top-24 hidden md:block border-r border-zinc-200 dark:border-zinc-800 pr-6 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-4">
            On This Page
          </h5>
          <nav className="space-y-2.5">
            {headings.map((heading, index) => (
              <a
                key={index}
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(heading.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`block text-xs font-sans transition-all hover:text-foreground ${
                  heading.level === 2
                    ? "pl-3"
                    : heading.level === 3
                      ? "pl-6"
                      : heading.level === 4
                        ? "pl-9"
                        : ""
                } ${
                  activeId === heading.id
                    ? "text-foreground font-medium border-l-2 border-zinc-950 dark:border-zinc-50 pl-2 -ml-2"
                    : "text-muted-foreground"
                }`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </aside>
      )}

      <article className="prose prose-zinc dark:prose-invert max-w-3xl w-full text-sm leading-relaxed overflow-x-hidden">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            p: ({ children }) => (
              <p className="mb-6 last:mb-0 whitespace-pre-line leading-relaxed ">
                {children}
              </p>
            ),

            h1: ({ children }) => {
              const text = React.Children.toArray(children).join("");
              return (
                <h1
                  id={slugify(text)}
                  className="scroll-mt-24 font-display uppercase tracking-tight text-2xl font-bold mt-10 mb-6 border-b-2 pb-3"
                >
                  {children}
                </h1>
              );
            },
            h2: ({ children }) => {
              const text = React.Children.toArray(children).join("");
              return (
                <h2
                  id={slugify(text)}
                  className="scroll-mt-24 font-display uppercase tracking-tight text-xl font-semibold mt-8 mb-4 border-b pb-2"
                >
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = React.Children.toArray(children).join("");
              return (
                <h3
                  id={slugify(text)}
                  className="scroll-mt-24 font-display uppercase tracking-tight text-lg font-medium mt-6 mb-3"
                >
                  {children}
                </h3>
              );
            },
            h4: ({ children }) => {
              const text = React.Children.toArray(children).join("");
              return (
                <h4
                  id={slugify(text)}
                  className="scroll-mt-24 font-display uppercase tracking-tight text-base font-medium mt-4 mb-2"
                >
                  {children}
                </h4>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt || "Project Asset"}
                className="w-full rounded border border-zinc-200 dark:border-zinc-800 my-6 bg-zinc-50 dark:bg-zinc-900 object-cover"
                loading="lazy"
              />
            ),

            // ── SYNTAX HIGHLIGHTING ENGINE CONFIGURATIONS ─────────────────
            pre: ({ children }) => (
              <div className="my-4 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-[#282c34]">
                {children}
              </div>
            ),
            table: ({ children }) => (
              <div className="my-6 w-full overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
                <table className="w-full border-collapse text-left text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/40 transition-colors">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 align-middle">
                {children}
              </td>
            ),
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !match;

              if (isInline) {
                return (
                  <code
                    className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <SyntaxHighlighter
                  language={match[1] || "python"}
                  style={oneDark}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            },

            ul: ({ children }) => (
              <ul className="list-disc pl-6 space-y-1.5 my-4">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 space-y-1.5 my-4">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-sm marker:text-muted-foreground [&>p]:inline">
                {children}
              </li>
            ),
            details: ({ children }) => (
              <details className="group border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg my-5 overflow-hidden open:bg-zinc-50/80 dark:open:bg-zinc-900/80 transition-all">
                {children}
              </details>
            ),
            summary: ({ children }) => (
              <summary className="flex items-center gap-2.5 px-4 py-3 font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="transition-transform duration-200 group-open:rotate-90 text-[10px] text-zinc-400 shrink-0 select-none">
                  ▶
                </span>
                {children}
              </summary>
            ),
          }}
        >
          {processedMarkdown}
        </ReactMarkdown>
      </article>
    </div>
  );
}
