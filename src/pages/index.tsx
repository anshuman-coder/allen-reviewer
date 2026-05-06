import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleGithubSignIn = () => {
    void signIn("github", { callbackUrl: "/editor" });
  };

  const handleGuestContinue = () => {
    void router.push("/editor");
  };

  return (
    <>
      <Head>
        <title>Allen Reviewer — AI Code Review</title>
        <meta
          name="description"
          content="AI-powered code review. Paste your snippet, get instant feedback."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── Page Shell ── */}
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-bg">

        {/* ── Ambient background orbs ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {/* orange orb — top-left */}
          <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-orange-500 opacity-[0.12] blur-[120px]" />
          {/* blue orb — bottom-right */}
          <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#38BDF8] opacity-[0.10] blur-[140px]" />
          {/* purple orb — center */}
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 opacity-[0.07] blur-[160px]" />
        </div>

        {/* ── Subtle grid texture ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* ── Corner circuit accent lines ── */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-48 w-48 opacity-20"
          viewBox="0 0 192 192"
          fill="none"
        >
          <path d="M0 48 H40 V8" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0 96 H72 V24 H96" stroke="#F97316" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <circle cx="40" cy="8" r="3" fill="#F97316" />
          <circle cx="96" cy="24" r="2" fill="#F97316" opacity="0.6" />
        </svg>

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rotate-180 opacity-20"
          viewBox="0 0 192 192"
          fill="none"
        >
          <path d="M0 48 H40 V8" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0 96 H72 V24 H96" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <circle cx="40" cy="8" r="3" fill="#38BDF8" />
          <circle cx="96" cy="24" r="2" fill="#38BDF8" opacity="0.6" />
        </svg>

        {/* ── Auth Card ── */}
        <div
          className="animate-fade-in-up relative z-10 w-full max-w-sm px-4"
          style={{ animationDuration: "600ms", animationFillMode: "both" }}
        >
          <div
            className="glass-card flex flex-col items-center px-8 py-10"
            style={{
              background: "linear-gradient(145deg, rgba(59,16,102,0.85) 0%, rgba(42,10,82,0.90) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(91,42,138,0.6)",
              borderRadius: "20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)",
            }}
          >

            {/* ── Logo ── */}
            <div
              className="stagger-1 animate-fade-in-up mb-1"
              style={{ animationDuration: "500ms", animationDelay: "100ms", animationFillMode: "both" }}
            >
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
            <p
              className="stagger-2 animate-fade-in-up mb-8 text-center text-sm leading-relaxed"
              style={{
                color: "rgba(148,163,184,0.9)",
                animationDuration: "500ms",
                animationDelay: "200ms",
                animationFillMode: "both",
              }}
            >
              AI-powered code review, instantly.
            </p>

            {/* ── GitHub Button ── */}
            <button
              onClick={handleGithubSignIn}
              className="stagger-3 animate-fade-in-up group relative w-full overflow-hidden rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #EA6A08 100%)",
                border: "1px solid rgba(249,115,22,0.6)",
                boxShadow: "0 4px 16px rgba(249,115,22,0.25)",
                animationDuration: "500ms",
                animationDelay: "280ms",
                animationFillMode: "both",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 6px 24px rgba(249,115,22,0.45), 0 0 40px rgba(249,115,22,0.2)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 16px rgba(249,115,22,0.25)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              {/* shimmer sweep */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative flex items-center justify-center gap-3">
                {/* GitHub icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Sign in with GitHub
              </span>
            </button>

            {/* ── Divider ── */}
            <div
              className="stagger-4 animate-fade-in-up my-5 flex w-full items-center gap-3"
              style={{
                animationDuration: "500ms",
                animationDelay: "360ms",
                animationFillMode: "both",
              }}
            >
              <div
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(91,42,138,0.8) 80%)",
                }}
              />
              <span
                className="select-none text-xs font-medium tracking-widest"
                style={{ color: "rgba(148,163,184,0.6)" }}
              >
                OR
              </span>
              <div
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(91,42,138,0.8) 20%, transparent)",
                }}
              />
            </div>

            {/* ── Guest Button ── */}
            <button
              onClick={handleGuestContinue}
              className="stagger-5 animate-fade-in-up group w-full rounded-xl px-6 py-3 font-semibold transition-all duration-300"
              style={{
                background: "transparent",
                color: "#7DD3FC",
                border: "1px solid rgba(56,189,248,0.35)",
                animationDuration: "500ms",
                animationDelay: "440ms",
                animationFillMode: "both",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(56,189,248,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(56,189,248,0.65)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 20px rgba(56,189,248,0.15)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(56,189,248,0.35)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              <span className="flex items-center justify-center gap-3">
                {/* Guest icon */}
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
            <p
              className="mt-7 text-center text-xs leading-relaxed"
              style={{ color: "rgba(148,163,184,0.45)" }}
            >
              Guest sessions are not saved.{" "}
              <br />
              Sign in to keep your review history.
            </p>
          </div>
        </div>
      </main>

      {/* ── Inline keyframes (supplements globals.css) ── */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 600ms cubic-bezier(0.19,1,0.22,1) both;
        }
      `}</style>
    </>
  );
}