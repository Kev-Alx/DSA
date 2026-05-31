import HeaderNav from "@/components/header";
import BackgroundEffects from "@/components/background-effects";
import ChangelogContent from "@/components/experience";
import { V1_1_0_Content, V1_2_0_Content } from "@/components/contents";
import Education from "@/components/education";
import ProjectsGrid from "@/components/projects";

export const releases = [
  {
    version: "Most Recent",
    date: "Jan 2025 - Jul 2025",
    content: <V1_1_0_Content />,
  },
  {
    version: "1",
    date: "Jul 2023 - Jun 2024",
    content: <V1_2_0_Content />,
  },
];

export default async function Home() {
  return (
    <main className="relative min-height-screen bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-300 ">
      <BackgroundEffects />

      <div className="relative z-10">
        <HeaderNav />

        <section className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-72">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight">Top</h1>
            <p className="mt-4 text-slate-500">Subtitle</p>
          </div>

          <ChangelogContent releases={releases} />
          <Education />
          <ProjectsGrid />
        </section>
      </div>
    </main>
  );
}
