'use client';

import React from 'react';
import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  SendHorizonal,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12"> */}
          
          {/* Brand & Socials */}
          {/* <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8c52ff] rounded-full"></div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900">LMS Up Next</span>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-xs">
              Empowering education through elegant and intuitive learning experiences.
            </p>
            <div className="flex gap-3 sm:gap-4 pt-2">
              <a 
                href="#" 
                aria-label="Twitter"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#8c52ff] hover:text-white transition-all duration-200 group"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-white" />
              </a>
              <a 
                href="#" 
                aria-label="Facebook"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#8c52ff] hover:text-white transition-all duration-200 group"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-white" />
              </a>
              <a 
                href="#" 
                aria-label="Instagram"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#8c52ff] hover:text-white transition-all duration-200 group"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-white" />
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[#8c52ff] hover:text-white transition-all duration-200 group"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-white" />
              </a>
            </div>
          </div> */}

          {/* Explore */}
          {/* <div className="space-y-4">
            <h4 className="font-semibold text-base sm:text-lg text-gray-900">Explore</h4>
            <ul className="text-sm sm:text-base space-y-2.5 sm:space-y-3">
              <li>
                <Link href="/" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/instructors" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  Instructors
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  Events
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Information */}
          {/* <div className="space-y-4">
            <h4 className="font-semibold text-base sm:text-lg text-gray-900">Information</h4>
            <ul className="text-sm sm:text-base space-y-2.5 sm:space-y-3">
              <li>
                <Link href="/about-us" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Subscribe */}
          {/* <div className="space-y-4">
            <h4 className="font-semibold text-base sm:text-lg text-gray-900">Subscribe</h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Stay updated with our latest courses and offers.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                required
                className="flex-1 border border-gray-300 rounded-l-md px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-700
                          placeholder:text-gray-400
                          focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent
                          hover:border-[#8c52ff] transition-colors duration-200"
              />
              <button 
                type="submit"
                className="bg-[#8c52ff] text-white px-3 sm:px-4 rounded-r-md 
                          hover:bg-[#7841df] transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:ring-offset-2
                          active:scale-95"
                aria-label="Subscribe"
              >
                <SendHorizonal className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div> */}
        {/* </div> */}

        {/* Bottom Copyright */}
        <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm sm:text-base text-gray-700">
            <p className="text-center sm:text-left">
              © 2025 LMS  All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/terms" className="hover:text-[#8c52ff] transition-colors duration-200">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-[#8c52ff] transition-colors duration-200">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-[#8c52ff] transition-colors duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;