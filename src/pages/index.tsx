import SignInWithGithub from "@/components/global/SignInWithGithub";
import PageHelmet from "@/components/global/PageHelmet";
import AllenLogo from "@/components/icons/AllenLogo";
import GithubIcon from "@/components/icons/github";
import { BottomRightCircuit, TopLeftCircuit } from "@/components/icons/stroke";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import GuestIcon from "@/components/icons/Guest";
import ContinueAsGuest from "@/components/global/ContinueAsGuest";

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
              <AllenLogo />
            </div>

            {/* ── Tagline ── */}
            <p className="animate-fade-in-up delay-200 duration-500 mb-8 text-center text-sm leading-relaxed text-text-muted/90">
              AI-powered code review, instantly.
            </p>

            {/* ── GitHub Button ── */}
            <SignInWithGithub
              onClick={handleGithubSignIn}
            />

            {/* ── Divider ── */}
            <div className="animate-fade-in-up delay-360 duration-500 my-5 flex w-full items-center gap-3">
              <div className="h-px flex-1 [background:var(--gradient-divider-right)]" />
              <span className="select-none text-xs font-medium tracking-widest text-text-muted/60">
                OR
              </span>
              <div className="h-px flex-1 [background:var(--gradient-divider-left)]" />
            </div>

            {/* ── Guest Button ── */}
            <ContinueAsGuest
              onClick={handleGuestContinue}
            />

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
