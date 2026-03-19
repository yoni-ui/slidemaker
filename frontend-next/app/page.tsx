import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Nav — minimal, UserJot-style */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 px-6 py-4 backdrop-blur-sm lg:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">
              layers
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              SlideMaker
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-700"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — one line + subtext + badges + CTA */}
        <section className="px-6 py-20 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Collect feedback, prioritize with votes, auto-sync your roadmap
            </h1>
            <p className="mt-6 text-lg text-slate-600 lg:text-xl">
              SlideMaker is the complete presentation platform for modern teams.
              Beautiful decks from a prompt, roadmaps that stay in sync, and
              export to PDF or PowerPoint—ready in seconds.
            </p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-soft transition-all hover:bg-primary-700"
              >
                Get Started Free
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                Free forever
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                30-second setup
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                Unlimited decks
              </span>
            </div>
          </div>
        </section>

        {/* Value prop — listening to users */}
        <section className="border-y border-slate-200 bg-slate-50/50 px-6 py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Your audience is telling you what to present. Are you listening?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Teams using SlideMaker see faster deck creation because you start
              from a prompt—not a blank slide. No more scattered notes, rework,
              or last-minute design.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { stat: "5x faster", label: "From idea to first draft" },
                { stat: "Less rework", label: "AI structures content for you" },
                { stat: "Export ready", label: "PPTX and PDF, one click" },
                { stat: "Team aligned", label: "One place for every deck" },
              ].map((item) => (
                <div
                  key={item.stat}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
                >
                  <p className="text-2xl font-bold text-primary">{item.stat}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features — beautiful boards / roadmap / changelog style */}
        <section id="features" className="px-6 py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Beautiful decks where great ideas are born
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
              Give your team a dedicated space to create. Start from a prompt,
              pick a template, or import—then export to PowerPoint or PDF.
            </p>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "AI from a prompt",
                  desc: "Describe your topic; get a full deck outline and slide content in seconds.",
                  icon: "auto_awesome",
                },
                {
                  title: "Templates & layouts",
                  desc: "24+ layouts: hero, bullet list, two-column, timeline, quote, and more.",
                  icon: "dashboard",
                },
                {
                  title: "Export to PPTX & PDF",
                  desc: "Editable PowerPoint and PDF. One click, no design lock-in.",
                  icon: "download",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-2xl">
                      {f.icon}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — 3 steps */}
        <section id="how-it-works" className="border-t border-slate-200 bg-slate-50/50 px-6 py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Up and running in 30 seconds
            </h2>
            <div className="mt-16 grid gap-10 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Describe your deck",
                  desc: "Enter a topic or prompt. No credit card, no long form.",
                },
                {
                  step: "2",
                  title: "Generate & edit",
                  desc: "AI drafts slides; you edit text and pick layouts in the visual editor.",
                },
                {
                  step: "3",
                  title: "Export or present",
                  desc: "Download PPTX or PDF, or present full-screen from the app.",
                },
              ].map((s) => (
                <div key={s.step} className="relative">
                  <div className="flex size-10 items-center justify-center rounded-full border-2 border-primary bg-white text-sm font-bold text-primary">
                    {s.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 px-8 py-16 text-center lg:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Stop losing time to blank slides
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              When you start from a prompt, you’re already ahead. Export to
              PowerPoint or PDF and keep full control.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-soft transition-all hover:bg-primary-700"
            >
              Start Building Better Decks
            </Link>
            <p className="mt-4 text-sm text-slate-500">
              Free forever · No credit card · 30-second setup
            </p>
          </div>
        </section>
      </main>

      {/* Footer — UserJot-style columns */}
      <footer className="border-t border-slate-200 bg-white px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-primary">
                  layers
                </span>
                <span className="font-semibold text-slate-900">SlideMaker</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                The presentation platform for modern teams. Create, export, and
                present—without the busywork.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Product
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/editor" className="text-slate-600 hover:text-primary">
                    Create deck
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="text-slate-600 hover:text-primary">
                    Templates
                  </Link>
                </li>
                <li>
                  <a href="#features" className="text-slate-600 hover:text-primary">
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Resources
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/terms" className="text-slate-600 hover:text-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-600 hover:text-primary">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Company
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="#" className="text-slate-600 hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} SlideMaker. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-primary">Terms</Link>
              <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
