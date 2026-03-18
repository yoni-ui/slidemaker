import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeckShare – Stunning Presentations Instantly",
  description:
    "Build professional, high-converting decks in minutes. Real-time collaboration, beautiful templates, and seamless sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#f6f6f8] text-slate-900 font-display antialiased">
        {children}
      </body>
    </html>
  );
}
