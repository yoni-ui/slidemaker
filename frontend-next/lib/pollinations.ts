/**
 * Pollinations.ai — free image generation, no API key required.
 * https://image.pollinations.ai/prompt/{text}
 */

export const pollinationsUrl = (
  prompt: string,
  w = 960,
  h = 540,
  seed?: number
): string => {
  const params = new URLSearchParams({
    width: String(w),
    height: String(h),
    nologo: "true",
  })
  if (seed != null) params.set("seed", String(seed))
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`
}
