import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Budapest Labs";

const taglines: Record<string, string> = {
  hu: "Prémium weboldal, napokon belül. 0 Ft belépő, havi 19 900 Ft-tól.",
  en: "A premium website, within days. €0 up front, from €49/month.",
  de: "Eine Premium-Website, in wenigen Tagen. 0 € Startkosten, ab 49 €/Monat.",
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
          backgroundColor: "#000",
          color: "#f7f7f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: "-0.03em" }}>
          Budapest Labs
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#a3a3a3" }}>
          {tagline}
        </div>
      </div>
    ),
    size
  );
}
