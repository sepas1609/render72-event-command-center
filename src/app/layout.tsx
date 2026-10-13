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
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://render72-command-center.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FlagHorizon — Campus Capture the Flag Command Center",
    template: "%s · FlagHorizon Sentinel",
  },
  description:
    "FlagHorizon is a jeopardy-style campus Capture the Flag command center with live telemetry, an interactive defense map, dynamic scoring, and the full Render72 events board — engineered for security-curious students.",
  applicationName: "FlagHorizon Sentinel",
  generator: "Next.js",
  keywords: [
    "FlagHorizon",
    "Capture the Flag",
    "CTF",
    "Cybersecurity",
    "Web Security",
    "Digital Forensics",
    "Cryptography",
    "Reverse Engineering",
    "Campus Hackathon",
    "Render72",
    "Jeopardy CTF",
  ],
  authors: [{ name: "FlagHorizon Sentinel Team" }],
  creator: "FlagHorizon Sentinel Team",
  publisher: "FlagHorizon Sentinel Team",
  category: "cybersecurity",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: "FlagHorizon — Campus Capture the Flag Command Center",
    description:
      "Live CTF command center with telemetry, defense map, dynamic scoring, and the full Render72 campus events board. A cybersecurity arena for student teams.",
    url: SITE_URL,
    siteName: "FlagHorizon",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Hands typing code on a laptop at FlagHorizon CTF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlagHorizon — Campus Capture the Flag Command Center",
    description:
      "Live CTF command center with telemetry, defense map, and dynamic scoring for student teams.",
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
  name: "FlagHorizon: Campus Capture the Flag",
  description:
    "Jeopardy-style capture-the-flag contest across web security, forensics, cryptography and reverse engineering in an isolated sandbox.",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  startDate: "2026-11-15T10:00:00+05:30",
  endDate: "2026-11-15T17:30:00+05:30",
  url: SITE_URL,
  image:
    "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
  organizer: {
    "@type": "Organization",
    name: "Cyber Defence Guild",
    url: "https://render72.pages.dev",
  },
  offers: {
    "@type": "Offer",
    name: "Team registration",
    price: "300",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: "https://render72.pages.dev/api/test/events/a6de479e-c82e-567a-a7a8-61207e455385",
    validFrom: "2026-10-13T00:00:00+05:30",
  },
  location: {
    "@type": "VirtualLocation",
    name: "FlagHorizon Virtual Security Arena",
    url: SITE_URL,
  },
  keywords:
    "CTF, Capture the Flag, Cybersecurity, Web Security, Forensics, Cryptography, Reverse Engineering",
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
