// app/page.tsx
import fs from "fs";
import path from "path";
import { Dashboard, DashboardPage } from "../components/dashboard";

export default async function Home() {
  // 1. Construct the absolute path to your markdown file
  const filePath = path.join(process.cwd(), "dbpages", "dua.txt");
  const filePath2 = path.join(process.cwd(), "dbpages", "sc.txt");

  // 2. Read the file synchronously (or use fs.promises.readFile)
  const markdownString = fs.readFileSync(filePath, "utf8");
  const markdownString2 = fs.readFileSync(filePath2, "utf8");

  // 3. Pass it to your client components
  return (
    <Dashboard>
      <DashboardPage title="Overview" md={markdownString} />
      <DashboardPage title="Overview 2" md={markdownString2} />
      {/* 
        For multiple pages, you would just read multiple files:
        <DataPage title="Data" smd={dataMdString} /> 
      */}
    </Dashboard>
  );
}
