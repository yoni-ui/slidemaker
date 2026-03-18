const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
    : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type SlideContent = {
  title: string;
  subtitle?: string | null;
  bullets: string[];
  layout?: string | null;
  theme?: string | null;
};

export type GenerateResponse = {
  slides: SlideContent[];
};

export async function generateSlides(
  prompt: string
): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to generate slides");
  }
  return res.json() as Promise<GenerateResponse>;
}

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json() as Promise<{ status: string }>;
}
