import PageHelmet from "@/components/global/PageHelmet";
import { BottomRightCircuit, TopLeftCircuit } from "@/components/icons/stroke";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleGithubSignIn = () => {
    void signIn("github", { callbackUrl: "/editor" });
  };

  const handleGuestContinue = () => {
    void router.push("/c/abc");
  };

  return (
    <>
      <PageHelmet
        title="AI Code Review"
        description="AI-powered code review. Paste your snippet, get instant feedback."
      />

      {/* ── Page Shell ── */}
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-bg">

        {/* ── Ambient background orbs ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-orange-500 opacity-[0.12] blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-blue-400 opacity-[0.10] blur-[140px]" />
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 opacity-[0.07] blur-[160px]" />
        </div>

        {/* ── Subtle grid texture ── */}
        <div aria-hidden="true" className="grid-texture pointer-events-none absolute inset-0 opacity-[0.035]" />

        {/* ── Corner circuit accent lines ── */}
        <TopLeftCircuit />
        <BottomRightCircuit />

        {/* ── Auth Card ── */}
        <div className="animate-fade-in-up duration-600 relative z-10 w-full max-w-sm px-4">
          <div className="auth-card flex flex-col items-center px-8 py-10">

            {/* ── Logo ── */}
            <div className="animate-fade-in-up delay-100 duration-500 mb-1">
              <Image
                src="/logo.png"
                alt="Allen Reviewer"
                width={160}
                height={160}
                priority
                className="drop-shadow-[0_0_24px_rgba(139,92,246,0.5)]"
              />
            </div>

            {/* ── Tagline ── */}
            <p className="animate-fade-in-up delay-200 duration-500 mb-8 text-center text-sm leading-relaxed text-text-muted/90">
              AI-powered code review, instantly.
            </p>

            {/* ── GitHub Button ── */}
            <button
              onClick={handleGithubSignIn}
              className="animate-fade-in-up delay-200 duration-500 group relative w-full overflow-hidden rounded-xl border border-orange-500/60 bg-linear-[135deg] from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all shadow-btn-github hover:-translate-y-px hover:shadow-btn-github-hover"
            >
              {/* shimmer sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center gap-3">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Sign in with GitHub
              </span>
            </button>

            {/* ── Divider ── */}
            <div className="animate-fade-in-up delay-360 duration-500 my-5 flex w-full items-center gap-3">
              <div className="h-px flex-1 [background:var(--gradient-divider-right)]" />
              <span className="select-none text-xs font-medium tracking-widest text-text-muted/60">
                OR
              </span>
              <div className="h-px flex-1 [background:var(--gradient-divider-left)]" />
            </div>

            {/* ── Guest Button ── */}
            <button
              onClick={handleGuestContinue}
              className="animate-fade-in-up delay-440 duration-500 group w-full rounded-xl border border-blue-400/35 bg-transparent px-6 py-3 font-semibold text-blue-300 transition-all hover:-translate-y-px hover:border-blue-400/65 hover:bg-blue-400/8 hover:shadow-btn-guest-hover"
            >
              <span className="flex items-center justify-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Continue as Guest
              </span>
            </button>

            {/* ── Footer note ── */}
            <p className="mt-7 text-center text-xs leading-relaxed text-text-muted/45">
              Guest sessions are not saved.{" "}
              <br />
              Sign in to keep your review history.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
