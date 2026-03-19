import path from "path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
  // GROQ_API_KEY is server-side only — never expose it to the browser.
  // NEXT_PUBLIC_API_URL is opt-in for pointing at an external backend.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fonts.googleapis.com" },
      { protocol: "https", hostname: "fonts.gstatic.com" },
    ],
  },
}

export default nextConfig
