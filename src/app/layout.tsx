import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budapest Labs — Weboldal 6 óra alatt",
  description:
    "Professzionális, mobilbarát weboldalak kisvállalkozásoknak — 6 órán belül elkészítve.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
