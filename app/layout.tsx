
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travailaway | Travel. Connect. Experience.",
  description:
    "Discover meaningful cultural exchange opportunities and connect with hosts around the world. By Molongi Investments Company SMC Limited.",
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
