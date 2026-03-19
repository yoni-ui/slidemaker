import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md lg:px-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-primary">
              layers
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              DeckShare
            </h2>
          </div>
          <nav className="hidden items-center gap-10 md:flex">
            <a
              href="#features"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
            >
              Features
            </a>
            <a
              href="#solutions"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
            >
              Solutions
            </a>
            <a
              href="#pricing"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
            >
              Pricing
            </a>
            <a
              href="#resources"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
            >
              Resources
            </a>
          </nav>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="hidden text-sm font-bold text-slate-600 hover:text-primary sm:block"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#f6f6f8] px-6 py-20 lg:px-20 lg:py-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="material-symbols-outlined text-[14px]">
                  auto_awesome
                </span>
                New: AI-Powered Slide Designer
              </div>
              <h1 className="text-6xl font-black leading-[1.1] tracking-tight text-slate-900 lg:text-8xl">
                Create <br />
                <span className="text-primary">Stunning</span> <br />
                Presentations Instantly
              </h1>
              <p className="max-w-lg text-xl leading-relaxed text-slate-600">
                Build professional, high-converting decks in minutes. Real-time
                collaboration, beautiful templates, and seamless sharing for
                modern teams.
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all hover:scale-[1.02]"
                >
                  Get Started for Free
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  href="/editor?template=pitch-deck"
                  className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-slate-50"
                >
                  View Demo
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-800/10" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#f6f6f8] px-6 py-32 text-center lg:px-20">
          <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <h2 className="text-6xl font-black leading-tight tracking-tight text-slate-900 lg:text-7xl">
              Ready to wow your audience?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Join professionals who use DeckShare to land deals, raise capital,
              and inspire teams.
            </p>
            <div className="mt-4 flex flex-col items-center gap-6">
              <Link
                href="/signup"
                className="w-full rounded-2xl bg-primary px-12 py-5 text-xl font-bold text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] sm:w-auto"
              >
                Get Started for Free
              </Link>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                No credit card required
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-[13px] font-medium text-slate-500 md:flex-row">
            <p>© 2024 DeckShare. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/terms" className="transition-colors hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-primary">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
