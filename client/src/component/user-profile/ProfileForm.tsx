'use client';

import { RootState } from '@/store/Store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ProfileForm = () => {
  const { username } = useSelector((state: RootState) => state.userAuth);

  const [form, setForm] = useState({
    firstName: username || '', // prefill with username
    lastName: '',
    headline: '',
    biography: '',
    language: 'English (US)',
    website: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Public profile</h2>
      <p className="text-sm text-gray-500 mb-6">Add information about yourself</p>

      <div className="space-y-4">
        {/* Basics */}
        <div>
          <label className="text-sm font-medium block mb-1">First name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Last name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Headline</label>
          <input
            name="headline"
            value={form.headline}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder='e.g. "Instructor at Udemy"'
            maxLength={60}
          />
        </div>

        {/* Biography */}
        <div>
          <label className="text-sm font-medium block mb-1">Biography</label>
          <textarea
            name="biography"
            value={form.biography}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Write a short bio (no links or codes)"
          />
          <p className="text-xs text-gray-400 mt-1">
            Links and coupon codes are not permitted in this section.
          </p>
        </div>

        {/* Language */}
        <div>
          <label className="text-sm font-medium block mb-1">Language</label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>

        {/* Links */}
        <div>
          <label className="text-sm font-medium block mb-1">Website</label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website (http://...)"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
