"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NavbarAction from "@/components/common/navbar/navbar-action";
import NavbarCategoryDropdown from "@/components/common/navbar/navbar-category-dropdown";
import { navbarItems } from "@/components/common/navbar/navbar-data";

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      className={
        mobile
          ? "flex flex-col border-t border-[#edf0ed] px-4 py-2 md:hidden"
          : "hidden items-center gap-7 md:flex"
      }
    >
      {navbarItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            mobile
              ? "border-b border-[#edf0ed] py-3 text-sm font-medium text-[#425047] transition-colors last:border-0 hover:text-[#198754]"
              : "py-5 text-sm font-medium text-[#526057] transition-colors hover:text-[#198754]"
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function SearchBox({ mobile = false }: { mobile?: boolean }) {
  return (
    <form
      action="/products"
      method="get"
      role="search"
      className={`flex h-11 items-center overflow-hidden rounded-lg border border-[#dfe5e0] bg-[#f8faf8] transition focus-within:border-[#198754] focus-within:ring-2 focus-within:ring-[#198754]/10 ${
        mobile ? "w-full md:hidden" : "hidden min-w-0 flex-1 md:flex"
      }`}
    >
      <input
        type="search"
        name="search"
        placeholder="Search for products"
        aria-label="Search for products"
        className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-[#27382d] outline-none placeholder:text-[#929c95]"
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Search"
        className="mr-1 size-9 rounded-md bg-[#198754] text-white hover:bg-[#157347]"
      >
        <Search className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}

export default function Navbar({
  isAuthenticated,
  cartItemCount,
}: {
  isAuthenticated: boolean;
  cartItemCount?: number;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-[#e9ede9] bg-white">
      <div className="border-b border-[#e6ebe7] bg-[#f4f7f4]">
        <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-4 px-4 text-xs text-[#68756c] sm:px-6 lg:px-8">
          <p className="truncate">
            Super Value Deals <span className="px-1 text-[#a2aba4]">|</span>{" "}
            Save more with coupons
          </p>
          <p className="hidden shrink-0 sm:block">
            Free shipping on orders over $50
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-3 gap-y-4 px-4 py-4 sm:px-6 md:grid-cols-[auto_minmax(220px,1fr)_auto] lg:gap-8 lg:px-8">
        <Link
          href="/"
          aria-label="FreshCart home"
          className="flex w-fit items-center"
        >
          <Image
            src="https://freshcart-route.vercel.app/_next/static/media/freshcart-logo.49f1b44d.svg"
            alt="FreshCart"
            width={160}
            height={40}
            priority
            unoptimized
            className="h-9 w-auto"
          />
        </Link>

        <SearchBox />

        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
          {!isAuthenticated ? (
            <NavbarAction
              href="/login"
              label="Account"
              hint="Sign in"
              icon={<UserRound className="size-5" />}
              className="max-[380px]:hidden"
            />
          ) : null}
          <NavbarAction
            href="/wishlist"
            label="Wishlist"
            hint="Saved items"
            icon={<Heart className="size-5" />}
            className="max-[380px]:hidden"
          />
          <NavbarAction
            href="/cart"
            label="My cart"
            hint="View cart"
            icon={<ShoppingBag className="size-5" />}
            badge={cartItemCount ? String(cartItemCount) : undefined}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="ml-1 size-10 rounded-full text-[#34443b] hover:bg-[#f1f6f2] md:hidden"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        <div className="col-span-2 md:hidden">
          <SearchBox mobile />
        </div>
      </div>

      <div className="hidden border-t border-[#edf0ed] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <NavbarCategoryDropdown />
            <NavigationLinks />
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-2 text-xs font-medium text-[#6d7971] transition-colors hover:text-[#198754] xl:flex"
          >
            <MapPin className="size-4 text-[#198754]" aria-hidden="true" />
            Deliver to your location
          </Link>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div id="mobile-navigation">
          <div className="border-t border-[#edf0ed] px-4 py-2">
            <NavbarCategoryDropdown mobile />
          </div>
          <NavigationLinks mobile />
        </div>
      ) : null}
    </header>
  );
}
