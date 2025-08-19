// components/Header/MobileMenu.tsx
"use client";

import Link from "next/link";


interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
 
}

const options = [
  { label: "Home", href: "/home"},
  { label: "Explore", href: "/explore"},
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Login", href: "/auth" },
];

const MobileMenu = ({ isOpen, closeMenu,  }: MobileMenuProps) => {
  if (!isOpen) return null;


  return (
    <div  className="absolute top-full left-0 w-full bg-white shadow-lg z-50 p-6 flex flex-col space-y-4 md:hidden">
      {options
      
        .map((opt) => (
          <Link
            key={opt.label}
            href={opt.href}
            onClick={closeMenu}
            className="text-gray-800 hover:text-blue-600 transition"
          >
            {opt.label}
          </Link>
        ))}

     
    </div>
  );
};

export default MobileMenu;
