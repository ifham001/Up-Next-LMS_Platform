"use client";

import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const options = [
  { label: "Home", href: "/"},
  { label: "Explore", href: "/explore"},
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

const MobileMenu = ({ isOpen, closeMenu }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-gray-700 text-white rounded-lg shadow-lg mt-3 p-6 flex flex-col gap-4 md:hidden z-50">
      {options.map((opt) => (
        <Link
          key={opt.label}
          href={opt.href}
          onClick={closeMenu}
          className="hover:text-[#ff5e1a] transition border-b border-gray-600 pb-2 last:border-b-0"
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
};

export default MobileMenu;