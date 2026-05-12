export const TopLeftCircuit = () => (
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
)

export const BottomRightCircuit = () => (
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
)