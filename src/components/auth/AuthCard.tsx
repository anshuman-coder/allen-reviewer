import { useRouter } from "next/router";
import ContinueAsGuest from "../global/ContinueAsGuest"
import SignInWithGithub from "../global/SignInWithGithub"
import AllenLogo from "../icons/AllenLogo"
import { signIn } from "next-auth/react"

const AuthCard = () => {
  const router = useRouter();

  const handleGithubSignIn = () => {
    void signIn("github", { callbackUrl: "/c/abc" });
  };

  const handleGuestContinue = () => {
    void router.push("/c/abc");
  };

  return (
    <div className="animate-fade-in-up duration-600 relative z-10 w-full max-w-sm px-4">
      <div className="auth-card flex flex-col items-center px-8 py-10">

        <div className="animate-fade-in-up delay-100 duration-500 mb-1">
          <AllenLogo />
        </div>

        <p className="animate-fade-in-up delay-200 duration-500 mb-8 text-center text-sm leading-relaxed text-text-muted/90">
          AI-powered code review, instantly.
        </p>

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

        <ContinueAsGuest
          onClick={handleGuestContinue}
        />

        <p className="mt-7 text-center text-xs leading-relaxed text-text-muted/45">
          Guest sessions are not saved.{" "}
          <br />
          Sign in to keep your review history.
        </p>
      </div>
    </div>
  )
}

export default AuthCard