/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";
import ReactECharts from "echarts-for-react";
import slugify from "slugify";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type PaddingSize = "sm" | "md" | "lg" | "xl";
type CodeTheme =
  | "github-light"
  | "github-dark"
  | "dracula"
  | "monokai"
  | "solarized-light";

interface CodeBlockSettings {
  /**
   * Syntax-highlight colour theme for fenced code blocks.
   * Note: this component uses manual token colouring, not an external highlighter,
   * so the theme affects background / text / chrome colours only (not per-token).
   * Plug in a highlighter such as `shiki` or `prism-react-renderer` for full highlighting.
   * Default: "github-light"
   */
  theme?: CodeTheme;
  /** Show a copy-to-clipboard button on hover. Default: true */
  copyButton?: boolean;
}

interface DashboardPageSettings {
  /** Show the right-hand TOC sidebar. Default: true */
  sidebar?: boolean;
  /** Draw a border around images and charts. Default: false */
  figureBorders?: boolean;
  /** Content area padding. Default: "md" */
  padding?: PaddingSize;
  /**
   * ECharts option object deep-merged as the base for every chart on this page.
   * Chart-specific options take priority over these defaults.
   */
  defaultChartStyle?: Record<string, any>;
  /** Code block appearance settings. */
  codeBlock?: CodeBlockSettings;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PADDING_MAP: Record<PaddingSize, string> = {
  sm: "1rem",
  md: "1.5rem",
  lg: "2.25rem",
  xl: "3.5rem",
};

interface ThemeTokens {
  background: string;
  headerBg: string;
  border: string;
  text: string;
  comment: string;
  label: string; // language badge text
  labelBg: string;
  scrollbar: string;
}

const CODE_THEMES: Record<CodeTheme, ThemeTokens> = {
  "github-light": {
    background: "#f6f8fa",
    headerBg: "#eaeef2",
    border: "#d0d7de",
    text: "#24292f",
    comment: "#6e7781",
    label: "#57606a",
    labelBg: "#eaeef2",
    scrollbar: "#d0d7de",
  },
  "github-dark": {
    background: "#161b22",
    headerBg: "#21262d",
    border: "#30363d",
    text: "#e6edf3",
    comment: "#8b949e",
    label: "#8b949e",
    labelBg: "#21262d",
    scrollbar: "#30363d",
  },
  dracula: {
    background: "#282a36",
    headerBg: "#21222c",
    border: "#44475a",
    text: "#f8f8f2",
    comment: "#6272a4",
    label: "#bd93f9",
    labelBg: "#21222c",
    scrollbar: "#44475a",
  },
  monokai: {
    background: "#272822",
    headerBg: "#1e1f1c",
    border: "#3e3d32",
    text: "#f8f8f2",
    comment: "#75715e",
    label: "#a6e22e",
    labelBg: "#1e1f1c",
    scrollbar: "#3e3d32",
  },
  "solarized-light": {
    background: "#fdf6e3",
    headerBg: "#eee8d5",
    border: "#d3cbb8",
    text: "#657b83",
    comment: "#93a1a1",
    label: "#586e75",
    labelBg: "#eee8d5",
    scrollbar: "#d3cbb8",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function deepMerge(target: any, source: any): any {
  if (!source) return target;
  const out = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (
      sv !== null &&
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      tv !== null &&
      typeof tv === "object" &&
      !Array.isArray(tv)
    ) {
      out[key] = deepMerge(tv, sv);
    } else {
      out[key] = sv;
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// REHYPE PLUGIN
// ─────────────────────────────────────────────────────────────────────────────

function rehypeCustomElements() {
  const CUSTOM = new Set(["grid-container", "grid-col", "collapsible"]);
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (CUSTOM.has(node.tagName)) node.properties = node.properties ?? {};
    });
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COPY BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function CopyButton({ text, theme }: { text: string; theme: ThemeTokens }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy to clipboard"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.25rem 0.5rem",
        borderRadius: "0.375rem",
        border: `1px solid ${theme.border}`,
        background: copied ? theme.headerBg : "transparent",
        color: copied ? theme.label : theme.comment,
        cursor: "pointer",
        fontSize: "0.75rem",
        fontFamily: "inherit",
        transition: "all 0.15s",
        lineHeight: 1,
      }}
      onMouseOver={(e) => {
        if (!copied) {
          e.currentTarget.style.background = theme.headerBg;
          e.currentTarget.style.color = theme.text;
        }
      }}
      onMouseOut={(e) => {
        if (!copied) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = theme.comment;
        }
      }}
    >
      {copied ? (
        // Checkmark
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 7l3.5 3.5L11 3.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // Clipboard
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="4"
            width="7.5"
            height="8.5"
            rx="1.25"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M4 4V2.75A.75.75 0 014.75 2h3.5a.75.75 0 01.75.75V4"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M1.5 3H3.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODE BLOCK
// ─────────────────────────────────────────────────────────────────────────────

function CodeBlock({
  language,
  code,
  theme,
  showCopy,
}: {
  language: string | null;
  code: string;
  theme: ThemeTokens;
  showCopy: boolean;
}) {
  return (
    <div
      style={{
        margin: "1.5em 0",
        borderRadius: "0.625rem",
        border: `1px solid ${theme.border}`,
        overflow: "hidden",
        background: theme.background,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.45rem 0.875rem",
          background: theme.headerBg,
          borderBottom: `1px solid ${theme.border}`,
          gap: "0.5rem",
        }}
      >
        {/* Language label + copy */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginLeft: "auto",
          }}
        >
          {language && (
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: theme.label,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              {language}
            </span>
          )}
          {showCopy && <CopyButton text={code} theme={theme} />}
        </div>
      </div>

      {/* Code body */}
      <pre
        style={{
          margin: 0,
          padding: "1rem 1.125rem",
          overflowX: "auto",
          lineHeight: 1.7,
          background: "transparent",
        }}
      >
        <code
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, 'Courier New', monospace",
            fontSize: "0.8375rem",
            color: theme.text,
            display: "block",
          }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLAPSIBLE
// ─────────────────────────────────────────────────────────────────────────────

function Collapsible({
  summary,
  children,
  defaultopen,
}: {
  summary?: string;
  children: React.ReactNode;
  defaultopen?: string;
}) {
  const [open, setOpen] = useState(
    defaultopen !== undefined && defaultopen !== "false",
  );
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>(open ? "auto" : "0px");

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) {
      const sh = el.scrollHeight;
      setHeight(`${sh}px`);
      const tid = setTimeout(() => setHeight("auto"), 280);
      return () => clearTimeout(tid);
    } else {
      setHeight(`${el.scrollHeight}px`);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setHeight("0px")),
      );
    }
  }, [open]);

  return (
    <div
      style={{
        margin: "1.25em 0",
        border: "1px solid #e2e8f0",
        borderRadius: "0.625rem",
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          padding: "0.75rem 1rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "0.9375rem",
          fontWeight: 500,
          color: "inherit",
          lineHeight: 1.5,
          transition: "background 0.15s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
        onMouseOut={(e) => (e.currentTarget.style.background = "none")}
      >
        <span>{summary ?? "Details"}</span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            color: "#94a3b8",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <path
            d="M2.5 5.5l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        ref={bodyRef}
        style={{
          height,
          overflow: "hidden",
          transition: "height 0.26s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            padding: "0.5rem 1rem 1rem",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

export function Dashboard({ children }: { children: React.ReactNode }) {
  const pages = React.Children.toArray(children).filter(React.isValidElement);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <nav className="flex justify-center p-4 border-b">
        <div className="flex space-x-1 bg-muted p-1 rounded-full">
          {pages.map((page: any, idx) => {
            const title =
              page.props.title || page.type?.name || `Page ${idx + 1}`;
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>
      </nav>
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {pages[activeIndex]}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardPage({
  md,
  title,
  settings = {},
}: {
  md: string;
  title?: string;
  settings?: DashboardPageSettings;
}) {
  const {
    sidebar = true,
    figureBorders = false,
    padding = "md",
    defaultChartStyle,
    codeBlock: codeBlockSettings = {},
  } = settings;

  const { theme: codeThemeName = "github-light", copyButton = true } =
    codeBlockSettings;

  const codeTheme = CODE_THEMES[codeThemeName] ?? CODE_THEMES["github-light"];
  const paddingValue = PADDING_MAP[padding] ?? PADDING_MAP.md;

  const figureWrapStyle: React.CSSProperties = figureBorders
    ? {
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        overflow: "hidden",
        background: "#ffffff",
      }
    : { borderRadius: "0.75rem", overflow: "hidden" };

  // ── TOC ────────────────────────────────────────────────────────────────────
  const toc = useMemo(() => {
    const headings: { level: number; text: string; slug: string }[] = [];
    const regex = /^(#{1,3})\s+(.+)$/gm;
    let match;
    while ((match = regex.exec(md)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2],
        slug: slugify(match[2], { lower: true, strict: true }),
      });
    }
    return headings;
  }, [md]);

  const handleTocClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
      e.preventDefault();
      document
        .getElementById(slug)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${slug}`);
    },
    [],
  );

  const [activeSlug, setActiveSlug] = useState<string>("");
  useEffect(() => {
    if (!sidebar || toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -65% 0px", threshold: 0 },
    );
    toc.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc, sidebar]);

  // ── Component map ──────────────────────────────────────────────────────────
  const components: any = useMemo(
    () => ({
      // ── Paragraphs ────────────────────────────────────────────────────────────
      p({ children }: any) {
        return (
          <p
            style={{ margin: "0 0 1.25em", lineHeight: 1.75, color: "inherit" }}
          >
            {children}
          </p>
        );
      },

      // ── Headings ──────────────────────────────────────────────────────────────
      h1({ children }: any) {
        const slug = slugify(String(children), { lower: true, strict: true });
        return (
          <h1
            id={slug}
            style={{
              fontSize: "2em",
              fontWeight: 700,
              lineHeight: 1.2,
              margin: "0 0 0.875em",
              letterSpacing: "-0.02em",
              color: "inherit",
            }}
          >
            {children}
          </h1>
        );
      },
      h2({ children }: any) {
        const slug = slugify(String(children), { lower: true, strict: true });
        return (
          <h2
            id={slug}
            style={{
              fontSize: "1.5em",
              fontWeight: 650,
              lineHeight: 1.3,
              margin: "2em 0 0.875em",
              letterSpacing: "-0.015em",
              color: "inherit",
            }}
          >
            {children}
          </h2>
        );
      },
      h3({ children }: any) {
        const slug = slugify(String(children), { lower: true, strict: true });
        return (
          <h3
            id={slug}
            style={{
              fontSize: "1.2em",
              fontWeight: 600,
              lineHeight: 1.4,
              margin: "1.75em 0 0.625em",
              color: "inherit",
            }}
          >
            {children}
          </h3>
        );
      },
      h4({ children }: any) {
        const slug = slugify(String(children), { lower: true, strict: true });
        return (
          <h4
            id={slug}
            style={{
              fontSize: "1em",
              fontWeight: 600,
              lineHeight: 1.5,
              margin: "1.5em 0 0.5em",
              color: "inherit",
            }}
          >
            {children}
          </h4>
        );
      },

      // ── Links ─────────────────────────────────────────────────────────────────
      a({ href, children, ...props }: any) {
        return (
          <a
            href={href}
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              transition: "opacity 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            {...props}
          >
            {children}
          </a>
        );
      },

      // ── Lists ─────────────────────────────────────────────────────────────────
      ul({ children }: any) {
        return (
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "1.625em",
              margin: "0 0 1.25em",
            }}
          >
            {children}
          </ul>
        );
      },
      ol({ children }: any) {
        return (
          <ol
            style={{
              listStyleType: "decimal",
              paddingLeft: "1.625em",
              margin: "0 0 1.25em",
            }}
          >
            {children}
          </ol>
        );
      },
      li({ children }: any) {
        return (
          <li style={{ margin: "0.35em 0", lineHeight: 1.75 }}>{children}</li>
        );
      },

      // ── Inline ────────────────────────────────────────────────────────────────
      strong({ children }: any) {
        return <strong style={{ fontWeight: 600 }}>{children}</strong>;
      },
      em({ children }: any) {
        return <em style={{ fontStyle: "italic" }}>{children}</em>;
      },

      // ── Blockquote ────────────────────────────────────────────────────────────
      blockquote({ children }: any) {
        return (
          <blockquote
            style={{
              borderLeft: "3px solid #cbd5e1",
              paddingLeft: "1.125em",
              margin: "1.5em 0",
              color: "#64748b",
              fontStyle: "italic",
            }}
          >
            {children}
          </blockquote>
        );
      },

      // ── HR ────────────────────────────────────────────────────────────────────
      hr() {
        return (
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e2e8f0",
              margin: "2.25em 0",
            }}
          />
        );
      },

      // ── Tables ────────────────────────────────────────────────────────────────
      table({ children }: any) {
        return (
          <div
            style={{
              margin: "1.75em 0",
              overflowX: "auto",
              borderRadius: "0.625rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              {children}
            </table>
          </div>
        );
      },
      thead({ children }: any) {
        return (
          <thead
            style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}
          >
            {children}
          </thead>
        );
      },
      tbody({ children }: any) {
        return <tbody>{children}</tbody>;
      },
      tr({ children, ...props }: any) {
        // remark-gfm passes the parent context; we use nth-child CSS-equivalent via index
        return (
          <tr
            style={{
              borderBottom: "1px solid #f1f5f9",
              transition: "background 0.1s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            {...props}
          >
            {children}
          </tr>
        );
      },
      th({ children, style: cellStyle }: any) {
        // remark-gfm passes alignment via the style prop
        return (
          <th
            style={{
              padding: "0.625rem 1rem",
              textAlign: (cellStyle?.textAlign as any) ?? "left",
              fontWeight: 600,
              fontSize: "0.8125rem",
              letterSpacing: "0.02em",
              color: "#475569",
              whiteSpace: "nowrap",
            }}
          >
            {children}
          </th>
        );
      },
      td({ children, style: cellStyle }: any) {
        return (
          <td
            style={{
              padding: "0.625rem 1rem",
              textAlign: (cellStyle?.textAlign as any) ?? "left",
              color: "inherit",
              verticalAlign: "top",
            }}
          >
            {children}
          </td>
        );
      },

      img({ src, alt, title: imgTitle }: any) {
        return (
          <figure style={{ margin: "1.75em 0" }}>
            <div style={figureWrapStyle}>
              <img
                src={src}
                alt={alt ?? ""}
                title={imgTitle}
                loading="lazy"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  borderRadius: figureBorders ? "0" : "0.75rem",
                }}
              />
            </div>
            {imgTitle && (
              <figcaption
                style={{
                  marginTop: "0.5em",
                  fontSize: "0.85em",
                  color: "#94a3b8",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                {imgTitle}
              </figcaption>
            )}
          </figure>
        );
      },

      // ── Code / Charts ─────────────────────────────────────────────────────────
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || "");
        const lang = match?.[1] ?? null;
        const rawText = String(children).replace(/\n$/, "");

        // Chart block
        if (!inline && lang === "chart") {
          try {
            const raw = JSON.parse(rawText);
            const merged = defaultChartStyle
              ? deepMerge(defaultChartStyle, raw)
              : raw;
            return (
              <figure style={{ margin: "1.75em 0" }}>
                <div
                  style={{
                    ...figureWrapStyle,
                    padding: figureBorders ? "1rem" : "0",
                    background: figureBorders ? "#ffffff" : "transparent",
                  }}
                >
                  <ReactECharts
                    option={merged}
                    style={{ height: "380px", width: "100%" }}
                  />
                </div>
              </figure>
            );
          } catch {
            return (
              <div
                style={{
                  color: "#dc2626",
                  padding: "0.875rem 1rem",
                  border: "1px solid #fca5a5",
                  borderRadius: "0.5rem",
                  fontSize: "0.875em",
                  background: "#fef2f2",
                }}
              >
                ⚠ Error parsing chart JSON
              </div>
            );
          }
        }

        // Inline code
        if (inline) {
          return (
            <code
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.875em",
                background: "#f1f5f9",
                borderRadius: "0.3rem",
                padding: "0.15em 0.45em",
                color: "#0f172a",
              }}
              {...props}
            >
              {children}
            </code>
          );
        }

        // Fenced code block — themed with copy button
        return (
          <CodeBlock
            language={lang}
            code={rawText}
            theme={codeTheme}
            showCopy={copyButton}
          />
        );
      },

      // ── Grid layout ───────────────────────────────────────────────────────────
      "grid-container"({
        cols,
        children,
      }: {
        cols?: string;
        children: React.ReactNode;
      }) {
        const colCount = cols === "3" ? 3 : cols === "2" ? 2 : 1;
        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
              gap: "1.5rem",
              margin: "1.5em 0",
            }}
          >
            {children}
          </div>
        );
      },
      "grid-col"({ children }: { children: React.ReactNode }) {
        return (
          <div
            style={{ minWidth: 0, display: "flex", flexDirection: "column" }}
          >
            {children}
          </div>
        );
      },

      // ── Collapsible ───────────────────────────────────────────────────────────
      collapsible({ summary, defaultopen, children }: any) {
        return (
          <Collapsible summary={summary} defaultopen={defaultopen}>
            {children}
          </Collapsible>
        );
      },
    }),
    [figureBorders, defaultChartStyle, figureWrapStyle, codeTheme, copyButton],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  const showSidebar = sidebar && toc.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "2.5rem",
        padding: paddingValue,
        width: "100%",
        boxSizing: "border-box",
        alignItems: "flex-start",
      }}
    >
      {/* Main content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: "1rem",
          lineHeight: 1.75,
          color: "inherit",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeCustomElements]}
          components={components}
        >
          {md}
        </ReactMarkdown>
      </div>

      {/* TOC sidebar */}
      {showSidebar && (
        <aside
          style={{
            width: "13rem",
            flexShrink: 0,
            position: "sticky",
            top: "1.5rem",
            alignSelf: "flex-start",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "#94a3b8",
              margin: "0 0 0.75rem",
            }}
          >
            On this page
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {toc.map((item, idx) => {
              const isActive = item.slug === activeSlug;
              return (
                <li
                  key={idx}
                  style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
                >
                  <a
                    href={`#${item.slug}`}
                    onClick={(e) => handleTocClick(e, item.slug)}
                    style={{
                      display: "block",
                      padding: "0.25rem 0.5rem",
                      marginBottom: "0.1rem",
                      fontSize: "0.8125rem",
                      lineHeight: 1.5,
                      borderRadius: "0.375rem",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? "#2563eb" : "#64748b",
                      background: isActive ? "#eff6ff" : "transparent",
                      borderLeft: isActive
                        ? "2px solid #2563eb"
                        : "2px solid transparent",
                      transition: "color 0.15s, background 0.15s",
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) e.currentTarget.style.color = "#1e293b";
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) e.currentTarget.style.color = "#64748b";
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </aside>
      )}
    </div>
  );
}
