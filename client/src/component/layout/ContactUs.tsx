'use client';

import React from 'react';

const ContactUs = () => {
  return (
    <section className="bg-[#f9fafb] py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Contact Us</h2>
        <p className="text-gray-600 text-sm md:text-base">
          Have a question or feedback? We'd love to hear from you. Fill out the form and we’ll get back to you as soon as possible.
        </p>
      </div>

      <form className="bg-white rounded-xl shadow-sm p-8 max-w-3xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              placeholder="John"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            rows={5}
            placeholder="How can we help you?"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-700 text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            Send Message
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactUs;
