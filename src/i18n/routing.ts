import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hu", "en", "de"],
  defaultLocale: "hu",
  // Hungarian lives at "/" (matches canonical URLs, sitemap, and JSON-LD)
  localePrefix: "as-needed",
  // Always open in Hungarian; visitors switch language with the navbar toggle
  localeDetection: false,
});
