import type { ButtonHTMLAttributes, FC } from "react"
import clsx from "clsx"
import GithubIcon from "../icons/github"

interface SignInWithGithubProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignInWithGithub: FC<SignInWithGithubProps> = ({ className, ...otherProps }) => {
  return (
    <button
      className={clsx(
        "animate-fade-in-up delay-200 duration-500 group relative w-full overflow-hidden rounded-xl border border-orange-500/60 bg-linear-[135deg] from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all shadow-btn-github hover:-translate-y-px hover:shadow-btn-github-hover",
        className,
      )}
      {...otherProps}
    >
      {/* shimmer sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center justify-center gap-3">
        <GithubIcon />
        Sign in with GitHub
      </span>
    </button>
  )
}

export default SignInWithGithub