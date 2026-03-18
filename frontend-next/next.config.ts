import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  // Tell Turbopack the real workspace root so it doesn't infer from lockfiles.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // GROQ_API_KEY is server-side only — never expose it to the browser.
  // NEXT_PUBLIC_API_URL is opt-in for pointing at an external backend.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fonts.googleapis.com" },
      { protocol: "https", hostname: "fonts.gstatic.com" },
    ],
  },
}

export default nextConfig
