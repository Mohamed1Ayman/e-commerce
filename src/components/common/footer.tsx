import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const linkGroups = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      {
        label: "Electronics",
        href: "/products?category=6439d58a0049ad0b52b9003f",
      },
      {
        label: "Men's Fashion",
        href: "/products?category=6439d2d167d9aa4ca970649f",
      },
      {
        label: "Women's Fashion",
        href: "/products?category=6439d5b90049ad0b52b90048",
      },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/profile" },
      { label: "Order History", href: "/profile/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Shopping Cart", href: "/cart" },
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Help Center", href: "/help" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", Icon: FaFacebookF, href: "https://www.facebook.com" },
  { label: "Instagram", Icon: FaInstagram, href: "https://www.instagram.com" },
  { label: "Twitter", Icon: FaTwitter, href: "https://www.twitter.com" },
  { label: "YouTube", Icon: FaYoutube, href: "https://www.youtube.com" },
] as const;

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e4eae5] bg-[#f7f9f7] text-[#526057]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-8 lg:px-8">
        <section>
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-[#198754]"
          >
            FreshCart
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#68756c]">
            FreshCart is your one-stop destination for quality products. From
            fashion to electronics, we bring you the best brands at competitive
            prices with a seamless shopping experience.
          </p>
          <address className="mt-5 space-y-3 text-sm not-italic">
            <a
              href="tel:+18001234567"
              className="flex items-center gap-2 transition-colors hover:text-[#198754]"
            >
              <Phone className="size-4 text-[#198754]" aria-hidden="true" />
              +1 (800) 123-4567
            </a>
            <a
              href="mailto:support@freshcart.com"
              className="flex items-center gap-2 transition-colors hover:text-[#198754]"
            >
              <Mail className="size-4 text-[#198754]" aria-hidden="true" />
              support@freshcart.com
            </a>
            <p className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-[#198754]"
                aria-hidden="true"
              />
              123 Commerce Street, New York, NY 10001
            </p>
          </address>
          <nav aria-label="Social media" className="mt-6 flex gap-2">
            {socialLinks.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-[#dfe5e0] bg-white text-[#526057] transition-colors hover:border-[#198754] hover:text-[#198754]"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </section>

        {linkGroups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-semibold text-[#26382d]">
              {group.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#198754]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-[#e4eae5]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-xs text-[#7b887e]">
            © 2026 FreshCart. All rights reserved.
          </p>
          <ul
            aria-label="Accepted payment methods"
            className="flex items-center gap-2"
          >
            {["VISA", "Mastercard", "PayPal"].map((method) => (
              <li
                key={method}
                className="rounded border border-[#dfe5e0] bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#425047]"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
