import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_ASPECT_RATIO = 858 / 190;
const LOGO_HEIGHT = 60;

export function Logotype({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="hirner & riehl architekten stadtplaner bda partg mbb"
      width={Math.round(LOGO_HEIGHT * LOGO_ASPECT_RATIO)}
      height={LOGO_HEIGHT}
      priority
      className={cn("h-[60px] w-auto", className)}
    />
  );
}
