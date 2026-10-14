import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const SITE_URL = "https://render72-command-center.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CampusPulse 360 — Spatial Campus Day-Planner & Festival Hub",
    template: "%s · CampusPulse 360",
  },
  description:
    "CampusPulse 360 is an immersive spatial campus day-planner with interactive venue heatmaps, conflict-free multi-track scheduling, and 6 bespoke creative arts ateliers across 30 campus events.",
  applicationName: "CampusPulse 360",
  generator: "Next.js",
  keywords: [
    "CampusPulse 360",
    "Campus Festival",
    "Day-Planner",
    "Spatial Planner",
    "Campus Events",
    "Render72",
    "Repair Café",
    "Photo Walk",
    "Rangoli Duet",
    "UX Lab",
    "Live Art",
    "Pottery Studio",
  ],
  authors: [{ name: "CampusPulse 360 Team" }],
  creator: "CampusPulse 360 Team",
  publisher: "CampusPulse 360 Team",
  category: "campus-festival",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: "CampusPulse 360 — Spatial Campus Day-Planner & Festival Hub",
    description:
      "Interactive multi-track spatial day planner with conflict-free scheduling and 6 bespoke creative ateliers for 30 campus events.",
    url: SITE_URL,
    siteName: "CampusPulse 360",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "CampusPulse 360 Spatial Festival Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusPulse 360 — Spatial Campus Day-Planner & Festival Hub",
    description:
      "Multi-track festival planner and interactive creative ateliers across 30 campus events.",
    images: [
      "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.svg",
  },
  manifest: undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050810" },
    { media: "(prefers-color-scheme: light)", color: "#050810" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Second Life: Campus Repair Café",
  description:
    "Hands-on diagnosis, precision soldering, garment mending, and cycle tuning with live component telemetry, diagnostic workbenches, and zero-waste repair certifications.",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  startDate: "2026-11-14T10:00:00+05:30",
  endDate: "2026-11-14T17:00:00+05:30",
  url: SITE_URL,
  image:
    "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
  organizer: {
    "@type": "Organization",
    name: "Sustainability & Maker Guild",
    url: "https://render72.pages.dev",
  },
  offers: {
    "@type": "Offer",
    name: "General Attendee Pass",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: "https://render72.pages.dev/api/test/events/f4a7eca2-0363-5f01-96d8-40b80e7d3798",
    validFrom: "2026-10-13T00:00:00+05:30",
  },
  location: {
    "@type": "Place",
    name: "Maker Space Courtyard & Engineering Lab 4",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Campus Grounds",
      addressCountry: "IN",
    },
  },
  keywords:
    "CampusPulse 360, Repair Cafe, Sustainability, Electronics Repair, Soldering, Maker Workshop, Campus Festival",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
        <SonnerToaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
