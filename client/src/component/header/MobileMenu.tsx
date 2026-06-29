"use client";

import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const options = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

const MobileMenu = ({ isOpen, closeMenu }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-2 z-50 mt-2 flex w-56 flex-col rounded-2xl border border-border bg-surface p-1.5 shadow-md md:hidden animate-fadeIn">
      {options.map((opt) => (
        <Link
          key={opt.label}
          href={opt.href}
          onClick={closeMenu}
          className="rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-brand-50 hover:text-brand-dark"
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
};

export default MobileMenu;
