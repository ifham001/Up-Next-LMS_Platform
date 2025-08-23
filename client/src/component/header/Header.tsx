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
import logo from '../../../public/images/up_next.svg'
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
      <nav className="flex items-center justify-between h-10 mt-6 ml-15 mr-15 relative  s">
        {/* Logo */}
        <div className="flex items-center space-x-2">
        
          <span className="font-bold text-lg"><Image className="mt-5" width={120} height={120} alt="sk" src={logo}/></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {manageOptions.map((opt) => (
              <Link href={opt.href} key={opt.label} className="text-gray-700 hover:text-blue-600 transition">
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
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
    )}
  </div>



          {token ? (
            <Avatar logoutHandler={logoutHandler} token={token} />
          ) : (
            <div>
            <Button className="hidden md:block w-20 h-10">
              <Link href="/auth">Login</Link>
              </Button>
              <Menu className="md:hidden" onClick={() => setMenuOpen(init=>!init)} />
              </div>
            
          )}
          <MobileMenu isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
        </div>

        {/* Mobile Menu Toggle */}
          

      
     
       

      </nav>
    </ClientOnly>
  );
}
