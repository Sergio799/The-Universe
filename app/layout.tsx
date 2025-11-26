import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sai Prakash - Full Stack Developer",
  description: "Full Stack Developer specializing in React, Node.js, TypeScript, and distributed systems. Explore my journey through innovative projects and technical expertise.",
  keywords: [
    "Sai Prakash",
    "Full Stack Developer",
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Web Development",
    "Software Engineer",
    "GraphQL",
    "AWS",
    "Docker",
    "Portfolio"
  ],
  authors: [{ name: "Sai Prakash" }],
  creator: "Sai Prakash",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Sai Prakash - Full Stack Developer",
    description: "Full Stack Developer specializing in modern web technologies and distributed systems",
    siteName: "Sai Prakash Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sai Prakash - Full Stack Developer",
    description: "Full Stack Developer specializing in modern web technologies",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-black text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
