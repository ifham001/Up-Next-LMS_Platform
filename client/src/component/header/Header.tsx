// components/Header/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import ClientOnly from "@/util/CilentOnly";
import { Menu, ShoppingCart } from "lucide-react";
import ThemeToggle from "@/ui/ThemeToggle";
import MobileMenu from "./MobileMenu";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";
import { userLogout } from "@/store/slices/user/userAuth-slice";
import { useDispatch } from "react-redux";

import { clearCart } from "@/store/slices/user/addToCart-slice";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { token , userId } = useSelector((state: RootState) => state.userAuth);
  const router = useRouter(); 
  const forNotification = useSelector((state: RootState) => state.addToCart.forNotification);

 
 

  const options = [
    { label: "Home", href: "/", showIf: true },
    { label: "Explore", href: "/explore", showIf: true},
    { label: "My Learning", href: "/user/learning", showIf: !!token },
    { label: "Profile", href: "/user/profile", showIf: !!token },
    { label: "About Us", href: "/about-us", showIf: !token },
    { label: "Contact Us", href: "/contact-us", showIf: !token },
  ];
  const [manageOptions,setManageOptions] = useState(options);

  const logoutHandler = () => {
    dispatch(userLogout());
    dispatch(clearCart())
    router.push('/');
  };

  useEffect(() => {
    setManageOptions(options.filter((opt) => opt.showIf));
  }, [token]);

  const shoppingCartHandler =()=>{
      if(token){
        return router.push(`/user/cart`)
      }
  }


  return (
    <ClientOnly>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span
              className="flex size-9 items-center justify-center rounded-xl bg-brand font-display text-lg font-bold text-white transition-transform duration-200 group-hover:-translate-y-px"
              style={{ boxShadow: 'var(--shadow-brand)' }}
            >
              ↑
            </span>
            <span className="font-display text-[22px] font-bold tracking-tight text-text-primary">
              UpNext
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 text-sm md:flex">
            {manageOptions.map((opt) => (
              <Link
                href={opt.href}
                key={opt.label}
                className="rounded-md px-3 py-1.5 font-medium text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary"
              >
                {opt.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />

            <button
              type="button"
              onClick={shoppingCartHandler}
              aria-label="Cart"
              className="relative inline-flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary"
            >
              <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {forNotification && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-bg"></span>
              )}
            </button>

            {token ? (
              <Avatar logoutHandler={logoutHandler} token={token} />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth" className="hidden md:block">
                  <button className="btn-primary px-4 py-2 text-sm font-medium">
                    Log in
                  </button>
                </Link>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary md:hidden"
                  onClick={() => setMenuOpen((init) => !init)}
                >
                  <Menu className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </div>
            )}
            <MobileMenu isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
          </div>
        </div>
      </header>
    </ClientOnly>
  );
}
