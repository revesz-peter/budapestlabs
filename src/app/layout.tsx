import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budapest Labs",
  description:
    "Professzionális, mobilbarát weboldalak — 6 órán belül elkészítve.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
