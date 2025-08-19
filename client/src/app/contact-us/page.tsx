"use client";

import Button from "@/ui/Button";
import React from "react";

export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Have questions, feedback, or need support? We’d love to hear from you. 
        Reach out to us using the form below or via our contact details.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Message</label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <Button
            type="submit"
            className="w-full  text-white py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Send Message
          </Button>
        </form>

        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
         
          <p className="text-gray-700">
            <span className="font-semibold">Phone:</span> +91 1234567890
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Address:</span> 123 Learning Street, 
            Knowledge City, India
          </p>
        </div>
      </div>
    </div>
  );
}
