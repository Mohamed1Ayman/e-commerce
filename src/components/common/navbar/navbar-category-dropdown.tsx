import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { navbarCategories } from "@/components/common/navbar/navbar-data";
import type { NavbarCategoryDropdownProps } from "@/types/navbar";

export default function NavbarCategoryDropdown({
  mobile = false,
}: NavbarCategoryDropdownProps) {
  return (
    <details
      className={`group relative ${mobile ? "md:hidden" : "hidden md:block"}`}
    >
      <summary
        className={
          mobile
            ? "flex min-h-11 cursor-pointer list-none items-center justify-between rounded-md px-3 text-sm font-semibold text-[#26382d] hover:bg-[#f1f6f2] [&::-webkit-details-marker]:hidden"
            : "flex h-10 cursor-pointer list-none items-center gap-2 rounded-md bg-[#198754] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#157347] [&::-webkit-details-marker]:hidden"
        }
      >
        <span className="flex items-center gap-2">
          <Menu className="size-4" aria-hidden="true" />
         Categories
        </span>
        <ChevronDown
          className="size-4 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <ul className="z-30 mt-1 grid grid-cols-1 gap-1 rounded-lg border border-[#e6ebe7] bg-white p-2 shadow-lg group-open:mt-2 sm:group-open:grid-cols-2 md:absolute md:left-0 md:top-full md:mt-0 md:w-[440px] md:group-open:mt-0">
        {navbarCategories.map((category) => (
          <li key={category.href}>
            <Link
              href={category.href}
              className="block rounded-md px-3 py-2.5 text-sm text-[#526057] transition-colors hover:bg-[#f1f6f2] hover:text-[#198754]"
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
