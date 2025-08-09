import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Space Explorer - Your Gateway to Space Exploration",
  description: "Explore rockets, satellites, launches, and the latest space news. Interactive 3D models, real-time launch countdowns, and comprehensive space data.",
  keywords: "space, rockets, satellites, launches, NASA, SpaceX, space exploration, astronomy",
  authors: [{ name: "Space Explorer Team" }],
  creator: "Space Explorer",
  publisher: "Space Explorer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://space-explorer.app'),
  openGraph: {
    title: "Space Explorer - Your Gateway to Space Exploration",
    description: "Explore rockets, satellites, launches, and the latest space news with interactive 3D models and real-time data.",
    url: 'https://space-explorer.app',
    siteName: 'Space Explorer',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Space Explorer - Interactive Space Exploration Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Space Explorer - Your Gateway to Space Exploration",
    description: "Explore rockets, satellites, launches, and the latest space news with interactive 3D models and real-time data.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
