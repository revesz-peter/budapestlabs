import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Budapest Labs";

const taglines: Record<string, string> = {
  hu: "Kevesebb adminisztráció, több idő a lényegre.",
  en: "Less admin, more time for what matters.",
  de: "Weniger Verwaltung, mehr Zeit für das Wesentliche.",
};

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = taglines[locale] ?? taglines.hu;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4efe6",
          color: "#3b2c22",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: "-0.03em" }}>
          Budapest Labs
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#9a5a3c" }}>
          {tagline}
        </div>
      </div>
    ),
    size
  );
}
