import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://budapestlabs.com";

  const locales = ["", "/en", "/de"];

  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/imprint", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return pages.flatMap((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l, i) => [
          ["hu", "en", "de"][i],
          `${baseUrl}${l}${page.path}`,
        ])
      ),
    },
  }));
}
