import type { Metadata } from "next";
import "./globals.css";
import LanguageSwitcher from "@/components/language-switcher";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <LanguageSwitcher />
      </body>
    </html>
  );
}
