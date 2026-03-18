import type { GenerateResponse } from "../types/slides";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function generateSlides(prompt: string): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate slides");
  }

  return (await response.json()) as GenerateResponse;
}

