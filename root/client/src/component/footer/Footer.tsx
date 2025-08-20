'use client';

import React from 'react';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  SendHorizonal,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-700 py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Socials */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-bold">
              LMS
            </div>
            <span className="text-lg font-semibold">Up Next</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Empowering education through elegant and intuitive learning experiences.
          </p>
          <div className="flex gap-3">
            <TwitterIcon className="w-4 h-4 text-gray-600 cursor-pointer hover:text-black" />
            <FacebookIcon className="w-4 h-4 text-gray-600 cursor-pointer hover:text-black" />
            <InstagramIcon className="w-4 h-4 text-gray-600 cursor-pointer hover:text-black" />
            <LinkedinIcon className="w-4 h-4 text-gray-600 cursor-pointer hover:text-black" />
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>Home</li>
            <li>Courses</li>
            <li>Instructors</li>
            <li>Resources</li>
            <li>Events</li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-semibold mb-3">Information</h4>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>About Us</li>
            <li>Blog</li>
            <li>FAQ</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h4 className="font-semibold mb-3">Subscribe</h4>
          <p className="text-sm text-gray-600 mb-4">
            Stay updated with our latest courses and offers.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none"
            />
            <button className="bg-slate-900 text-white px-3 rounded-r-md hover:bg-slate-700">
              <SendHorizonal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-10 border-t pt-4 text-center text-sm text-gray-300">
        © 2025 LMS UI Elegance. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
