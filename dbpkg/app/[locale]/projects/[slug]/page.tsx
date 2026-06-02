import fs from "fs";
import path from "path";
import { translations } from "@/constants/translations";
import { ProjectDetailsContent } from "@/components/project/project-detail-content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const locales = ["en", "id"];
  const slugs = [
    "electronic-store-ecommerce",
    "accommodation-analysis",
    "global-trade-war-analysis",
    "utils-or-tools",
    "index-petra",
    "simple-chart",
  ];

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

interface ProjectPageProps {
  params: Promise<{
    locale: "en" | "id";
    slug: string;
  }>;
}

export default async function StandaloneProjectPage({
  params,
}: ProjectPageProps) {
  const { locale, slug } = await params;
  const t = translations[locale]?.projects;

  if (!t) notFound();

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
      github: "https://github.com/Kev-Alx/DSA/tree/master/trade-war",
      detailsUrl: "/projects/global-trade-war-analysis",
    },
    {
      github: "#",
      demo: "https://utilsortools.vercel.app/",
      detailsUrl: "/projects/utils-or-tools",
    },
    { detailsUrl: "/projects/index-petra" },
    {
      demo: "https://simplestchart.vercel.app/",
      detailsUrl: "/projects/simple-chart",
    },
  ];

  const projectIdx = staticLinks.findIndex(
    (link) => link.detailsUrl === `/projects/${slug}`,
  );
  const baseItem = t.items[projectIdx];

  if (!baseItem) notFound();

  let markdownContent = "";
  const isDataProject =
    slug === "electronic-store-ecommerce" ||
    slug === "accommodation-analysis" ||
    slug === "global-trade-war-analysis";

  if (isDataProject) {
    try {
      const filePath = path.join(
        process.cwd(),
        "..",
        "markdown-files",
        `${slug}.md`,
      );
      const rawMarkdown = fs.readFileSync(filePath, "utf8");

      // Helper function to normalize any local path variation into a clean root path
      const normalizeLocalPath = (pathStr: string) => {
        return pathStr
          .trim()
          .replace(/^(\.\/|\.\\|\.)/, "") // Remove leading ./ or .\ or . if they exist
          .replace(/\\/g, "/") // Convert any Windows backslashes to forward slashes
          .replace(/^\/+/, ""); // Strip any remaining leading slashes to prevent duplicates
      };

      // 1. Convert standard Markdown images: Supports `./xxx/`, `xxx/`, and `/xxx/`
      // Ignores http:// and https://
      let updatedMarkdown = rawMarkdown.replace(
        /!\[(.*?)\]\(((?!https?:\/\/)[^)]+)\)/g,
        (_, alt, imgPath) => {
          return `![${alt}](/${normalizeLocalPath(imgPath)})`;
        },
      );

      // 2. Convert fallback HTML images if any exist
      // Ignores http:// and https://
      updatedMarkdown = updatedMarkdown.replace(
        /<img\s+([^>]*?)src=["']((?!https?:\/\/)[^"']+)["']([^>]*?)>/g,
        (_, beforeSrc, srcPath, afterSrc) => {
          return `<img ${beforeSrc}src="/${normalizeLocalPath(srcPath)}"${afterSrc}>`;
        },
      );

      markdownContent = updatedMarkdown;
    } catch (e) {
      markdownContent =
        "# README configuration error\nCould not locate data project file contents.";
    }
  }

  const fullProjectObject = {
    ...baseItem,
    links: staticLinks[projectIdx],
    detailsUrl: staticLinks[projectIdx].detailsUrl,
    markdownContent,
  };

  return (
    <main className="min-h-screen py-8 bg-background">
      <ProjectDetailsContent
        project={fullProjectObject}
        locale={locale}
        t={t}
        isStandalone={true}
      />
    </main>
  );
}
