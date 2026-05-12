import clsx from "clsx"
import type { ButtonHTMLAttributes, FC } from "react"
import GuestIcon from "../icons/Guest"

interface ContinueAsGuestProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ContinueAsGuest: FC<ContinueAsGuestProps> = ({ className, ...otherProps }) => {
  return (
    <button
      className={clsx(
        "animate-fade-in-up delay-440 duration-500 group w-full rounded-xl border border-blue-400/35 bg-transparent px-6 py-3 font-semibold text-blue-300 transition-all hover:-translate-y-px hover:border-blue-400/65 hover:bg-blue-400/8 hover:shadow-btn-guest-hover",
        className,
      )}
      {...otherProps}
    >
      <span className="flex items-center justify-center gap-3">
        <GuestIcon />
        Continue as Guest
      </span>
    </button>
  )
}

export default ContinueAsGuest