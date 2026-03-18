import { useState } from "react";
import { generateSlides } from "./services/api";
import type { SlideContent } from "./types/slides";

function App() {
  const [prompt, setPrompt] = useState("");
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateSlides(prompt.trim());
      setSlides(result.slides);
    } catch (e) {
      setError("Failed to generate slides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-4xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Slide Generator
          </h1>
          <p className="text-slate-400">
            Turn a topic into structured, PowerPoint-ready slide content.
          </p>
        </header>

        <section className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">
            Describe your presentation
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 5 slides about AI in education for an executive audience"
            className="w-full min-h-[120px] rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-vertical"
          />
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading || !prompt.trim()}
            className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-400 transition-colors"
          >
            {loading ? "Generating…" : "Generate slides"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Preview</h2>
          {slides.length === 0 ? (
            <p className="text-sm text-slate-500">
              Generated slides will appear here.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {slides.map((slide, index) => (
                <article
                  key={index}
                  className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      Slide {index + 1}
                    </span>
                    <span className="text-xs rounded-full border border-slate-700 px-2 py-0.5 text-slate-400">
                      {slide.layout ?? "auto-layout"}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="text-xs text-slate-400">{slide.subtitle}</p>
                  )}
                  {slide.bullets.length > 0 && (
                    <ul className="mt-1 space-y-1 text-xs text-slate-200">
                      {slide.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-[3px] h-[3px] w-[3px] rounded-full bg-slate-400" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;

