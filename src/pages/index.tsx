import PageHelmet from "@/components/global/PageHelmet";
import { BottomRightCircuit, TopLeftCircuit } from "@/components/icons/stroke";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import AuthCard from "@/components/auth/AuthCard";

export default function Home() {

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

        <AuthCard />
      </main>
    </>
  );
}
