'use client';

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
  return (
    <section className=" py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
            Contact Us
          </h2>
          <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed px-4 sm:px-0">
            Have a question or feedback? We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Form Section */}
        <form className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-5 sm:space-y-6">
          
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700
                          placeholder:text-gray-400
                          focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent
                          hover:border-[#8c52ff] transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700
                          placeholder:text-gray-400
                          focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent
                          hover:border-[#8c52ff] transition-colors duration-200"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent
                        hover:border-[#8c52ff] transition-colors duration-200"
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows={5}
              placeholder="How can we help you?"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700
                        placeholder:text-gray-400 resize-none
                        focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent
                        hover:border-[#8c52ff] transition-colors duration-200"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-2 sm:pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#8c52ff] hover:bg-[#7841df] text-white 
                        px-8 sm:px-10 lg:px-12 py-3 sm:py-3.5 
                        rounded-md text-sm sm:text-base font-medium
                        transition-all duration-200 ease-in-out
                        hover:shadow-lg hover:-translate-y-0.5
                        active:scale-95 active:shadow-md
                        focus:outline-none focus:ring-2 focus:ring-[#8c52ff] focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* Contact Information with Lucide Icons */}
        <div className="mt-12 sm:mt-16 lg:mt-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            
            {/* Email */}
            <div className="space-y-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14  bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#8c52ff]" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Email</h3>
              <p className="text-sm sm:text-base text-gray-700">support@lms.com</p>
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14  bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#8c52ff]" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Phone</h3>
              <p className="text-sm sm:text-base text-gray-700">+1 (555) 123-4567</p>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14  bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#8c52ff]" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Address</h3>
              <p className="text-sm sm:text-base text-gray-700">123 Learning St, Education City</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;