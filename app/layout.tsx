import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FX Journal",
  description: "A forex trade journal with risk, reward, and streak analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
