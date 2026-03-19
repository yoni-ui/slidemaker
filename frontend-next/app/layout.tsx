import type { Metadata } from "next"
import "./globals.css"
import { SupabaseProvider } from "@/components/SupabaseProvider"

export const metadata: Metadata = {
  title: "DeckShare – Stunning Presentations Instantly",
  description:
    "Build professional, high-converting decks in minutes. Real-time collaboration, beautiful templates, and seamless sharing.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@300;400;500;600;700&family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background-light text-slate-900 font-sans antialiased">
        <SupabaseProvider url={supabaseUrl} anonKey={supabaseAnonKey}>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
