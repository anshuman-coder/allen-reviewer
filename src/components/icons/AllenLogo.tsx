import Image from "next/image";
import type { FC } from "react";

const AllenLogo: FC = () => {
  return (
    <Image
      src="/logo.png"
      alt="Allen Reviewer"
      width={160}
      height={160}
      priority
      className="drop-shadow-[0_0_24px_rgba(139,92,246,0.5)]"
    />
  )
}

export default AllenLogo