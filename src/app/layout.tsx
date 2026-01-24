import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = "https://aiinst.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI INST | AI Solutions & Education Academy",
    template: "%s | AI INST"
  },
  description: "AI INST - Leading AI solutions provider and education academy. Professional AI services including Web Development, AI Consulting, Video Generation, and comprehensive AI courses.",
  keywords: ["AI", "Artificial Intelligence", "AI Courses", "AI Consulting", "Web Development", "AI Academy", "Machine Learning", "AI Education"],
  authors: [{ name: "AI INST" }],
  creator: "AI INST",
  publisher: "AI INST",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AI INST",
    title: "AI INST | AI Solutions & Education Academy",
    description: "Leading AI solutions provider and education academy. Professional AI services and comprehensive AI courses.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI INST - AI Solutions & Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI INST | AI Solutions & Education Academy",
    description: "Leading AI solutions provider and education academy. Professional AI services and comprehensive AI courses.",
    images: ["/og-image.png"],
    creator: "@aiinst",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-google-verification-code",
  },
};

// JSON-LD Structured Data for Organization
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "AI INST",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.png`,
      },
      sameAs: [
        "https://twitter.com/aiinst",
        "https://linkedin.com/company/aiinst",
        // Add more social profiles
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+94 71 744 2222",
        contactType: "customer service",
        email: "hello@aiinst.io",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "AI INST",
      description: "AI Solutions & Education Academy",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/courses?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#academy`,
      name: "AI INST Academy",
      url: `${siteUrl}/courses`,
      description: "Learn AI and modern web development with expert instructors",
      parentOrganization: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
