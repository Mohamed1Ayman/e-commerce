import type { NavbarCategory, NavbarItem } from "@/types/navbar";

export const navbarItems: NavbarItem[] = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/products" },
  { label: "Brands", href: "/brands" },
];

export const navbarCategories: NavbarCategory[] = [
  { label: "All categories", href: "" },
  { label: "Electronic", href: "/products?category=dairy-eggs" },
  { label: "Women's fashoin", href: "/products?category=meat-seafood" },
  { label: "Men's fashion", href: "/products?category=bakery-bread" },
  { label: "beauty & Health", href: "/products?category=snacks-sweets" }
];
