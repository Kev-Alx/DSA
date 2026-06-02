"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const browserLang = navigator.language || "en";
    const defaultLocale = browserLang.startsWith("id") ? "id" : "en";

    router.replace(`/${defaultLocale}/`);
  }, [router]);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
      </body>
    </html>
  );
}
