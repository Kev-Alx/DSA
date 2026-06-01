"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const browserLang = navigator.language || "en";
    const defaultLocale = browserLang.startsWith("id") ? "id" : "en";

    // Instantly push them to the localized static route
    router.replace(`/${defaultLocale}/`);
  }, [router]);

  // A minimal fallback screen during the split-second redirect
  return (
    <html className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
    </html>
  );
}
