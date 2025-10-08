// components/Header/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import ClientOnly from "@/util/CilentOnly";
import { CircleUserRound, Menu , ShoppingCart } from "lucide-react";
import Button from "@/ui/Button";
import MobileMenu from "./MobileMenu";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";
import { userLogout } from "@/store/slices/user/userAuth-slice";
import { useDispatch } from "react-redux";

import Image from "next/image";
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
      <nav  className=" w-full items-center justify-between relative  ">



        <div className="w-[95%] mx-auto flex h-20 mt-5 items-center justify-between px-6 py-3  relative ">
        <div className="flex items-center space-x-2">
        
          <span className=" w-10 h-10 bg-[#8c52ff] rounded-full"></span>
        </div>


        <div className="hidden text-sm md:flex items-center space-x-8">
          {manageOptions.map((opt) => (
              <Link href={opt.href} key={opt.label} className="text-gray-700 hover:text-[#8c52ff] transition">
                {opt.label}
              </Link>
            ))}
        </div>
        <div className="flex items-center space-x-4">
          
        </div>

        {/* Desktop Right Side */}
        <div className="flex  items-center space-x-4">
        <div className="relative">
    <ShoppingCart onClick={shoppingCartHandler} className="w-6 h-6 md:w-8 md:h-8" />
    {forNotification && (
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#8c52ff] rounded-full"></span>
    )}
  </div>



          {token ? (
            <Avatar logoutHandler={logoutHandler} token={token} />
          ) : (
            <div>
            <Button className="hidden md:block w-20 h-10 text-[#f5f5f5] text-sm bg-[#8c52ff]">
              <Link href="/auth">Login</Link>
              </Button>
              <Menu className="md:hidden" onClick={() => setMenuOpen(init=>!init)} />
              </div>
            
          )}
          <MobileMenu isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
        </div>

        {/* Mobile Menu Toggle */}
          

      
     
               </div>

      </nav>
    </ClientOnly>
  );
}
