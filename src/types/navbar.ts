import type { ReactNode } from "react";

export type NavbarItem = {
  label: string;
  href: string;
};

export type NavbarCategory = NavbarItem;

export type NavbarCategoryDropdownProps = {
  mobile?: boolean;
};

export type NavbarActionProps = {
  href: string;
  label: string;
  hint: string;
  icon: ReactNode;
  badge?: string;
  className?: string;
};
