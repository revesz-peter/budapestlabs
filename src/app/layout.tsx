import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budapest Labs",
  description:
    "Professzionális weboldal havi 9 900 forinttól. Induláskor nem fizet semmit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
