'use client';

import { RootState } from '@/store/Store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/ui/Button';

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

  const inputClass =
    'w-full rounded-md border border-input-border bg-input-bg text-text-primary placeholder:text-input-placeholder px-3 py-2 transition-colors focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30';
  const labelClass = 'text-sm font-medium text-text-primary block mb-1.5';

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="eyebrow">Account</span>
        <h2 className="display text-2xl text-text-primary mt-3">
          Public <span className="text-accent">profile</span>
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mt-2">Add information about yourself.</p>
      </div>

      <div className="space-y-5">
        {/* Basics */}
        <div>
          <label className={labelClass}>First name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Last name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Headline</label>
          <input
            name="headline"
            value={form.headline}
            onChange={handleChange}
            className={inputClass}
            placeholder='e.g. "Instructor at Udemy"'
            maxLength={60}
          />
        </div>

        {/* Biography */}
        <div>
          <label className={labelClass}>Biography</label>
          <textarea
            name="biography"
            value={form.biography}
            onChange={handleChange}
            rows={4}
            className={`${inputClass} resize-y`}
            placeholder="Write a short bio (no links or codes)"
          />
          <p className="text-xs text-text-muted mt-1.5">
            Links and coupon codes are not permitted in this section.
          </p>
        </div>

        {/* Language */}
        <div>
          <label className={labelClass}>Language</label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className={inputClass}
          >
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>

        {/* Links */}
        <div>
          <label className={labelClass}>Website</label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website (http://...)"
            className={inputClass}
          />
        </div>

        <div className="pt-2">
          <Button variant="primary">Save profile</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
