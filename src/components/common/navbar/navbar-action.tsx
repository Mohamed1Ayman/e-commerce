import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { NavbarActionProps } from "@/types/navbar";

export default function NavbarAction({
  href,
  label,
  hint,
  icon,
  badge,
  className,
}: NavbarActionProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className={`h-11 w-11 rounded-full p-0 text-[#34443b] hover:bg-[#f1f6f2] lg:h-auto lg:w-auto lg:px-2 ${className ?? ""}`}
    >
      <Link
        href={href}
        aria-label={`${label}: ${hint}`}
        className="relative flex items-center justify-center gap-2"
      >
        <span aria-hidden="true">{icon}</span>
        <span className="hidden text-left leading-tight lg:block">
          <span className="block text-[11px] text-[#839087]">{label}</span>
          <span className="block whitespace-nowrap text-xs font-semibold text-[#26382d]">
            {hint}
          </span>
        </span>
        {badge ? (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#f7c35f] text-[9px] font-bold text-[#26402f] lg:right-0 lg:top-0">
            {badge}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
