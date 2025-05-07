import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "./theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexable",
  description: "Next.js site with client-side editable content.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Nexable",
    images: ["/meta.png"],
    siteName: " Nexable",
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-main text-primary antialiased">
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}