import HeaderNav from "@/components/header";
import BackgroundEffects from "@/components/background-effects";
import ChangelogContent from "@/components/experience";
import { V1_1_0_Content, V1_2_0_Content } from "@/components/contents";
import Education from "@/components/education";
import ProjectsGrid from "@/components/projects";
import HeroSection from "@/components/hero";
import Contact from "@/components/contact";
import path from "path";
import fs from "fs";

interface HomeProps {
  params: Promise<{ locale: "en" | "id" }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const dataSlugs = [
    "electronic-store-ecommerce",
    "accommodation-analysis",
    "global-trade-war-analysis",
  ];
  const markdownMap: Record<string, string> = {};
  dataSlugs.forEach((slug) => {
    try {
      const filePath = path.join(
        process.cwd(),
        "..",
        "markdown-files",
        `${slug}.md`,
      );
      markdownMap[slug] = fs.readFileSync(filePath, "utf8");
    } catch (e) {
      markdownMap[slug] = "";
    }
  });
  const releases = [
    {
      version: "Most Recent",
      date: "Jan 2025 - Jul 2025",
      content: <V1_1_0_Content locale={locale} />,
    },
    {
      version: "1",
      date: "Jul 2023 - Jun 2024",
      content: <V1_2_0_Content locale={locale} />,
    },
  ];

  return (
    <main className="relative min-height-screen bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-300 ">
      <BackgroundEffects />
      <div className="relative z-10">
        <HeaderNav locale={locale} />
        <section className="max-w-4xl mx-auto px-6 pt-24 flex flex-col gap-12">
          <HeroSection locale={locale} />
          <ChangelogContent releases={releases} locale={locale} />
          <Education locale={locale} />
          <ProjectsGrid locale={locale} markdownData={markdownMap} />
          <Contact locale={locale} />
        </section>
      </div>
    </main>
  );
}
