import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/store/site-shell";

export const metadata: Metadata = {
  title: { default: "NORTHLINE — Everyday objects, considered", template: "%s · NORTHLINE" },
  description: "A considered edit of accessories, home objects, personal care and technology for everyday use.",
  keywords: ["ecommerce", "accessories", "home objects", "considered design"],
  openGraph: {
    type: "website",
    siteName: "NORTHLINE",
    title: "NORTHLINE — Everyday objects, considered",
    description: "Useful objects, quiet design, and considered materials for everyday life.",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "NORTHLINE everyday accessories collection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NORTHLINE — Everyday objects, considered",
    description: "Useful objects, quiet design, and considered materials for everyday life.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
