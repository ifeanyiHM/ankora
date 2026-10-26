import { SITE } from "@/config/site";
import "@fontsource-variable/space-grotesk";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const ogImage = `${SITE.url}/ankora_og.jpeg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },

  description: SITE.description,

  applicationName: SITE.name,
  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_NG",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Ankora — Nigerian and African fabrics, delivered",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: ogImage,
        alt: "Ankora — Nigerian and African fabrics, delivered",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
