"use client";

import React, { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import Button from "@/ui/Button";

const inputClasses =
  "w-full rounded-lg border border-input-border bg-input-bg px-3.5 py-2.5 text-sm text-text-primary " +
  "placeholder:text-input-placeholder " +
  "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 " +
  "transition-colors duration-150";

type FormState = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof FormState, string>>;

export default function ContactUs() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.message.trim()) next.message = "Write a short message.";

    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="max-w-2xl animate-fadeInUp">
        <span className="eyebrow">Get in touch</span>
        <h1 className="display mt-3 text-4xl font-semibold text-text-primary md:text-5xl">
          Contact <span className="text-accent">us</span>
        </h1>
        <p className="mt-3 max-w-[65ch] leading-relaxed text-text-secondary">
          Have a question, feedback, or need support? Send us a message and we will get back
          to you within a couple of business days.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-5 animate-fadeInUp delay-1">
        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="card md:col-span-3 space-y-5 p-6 sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <h2 className="text-lg font-semibold text-text-primary">Message sent</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
                Thanks for reaching out. We will reply to {form.email} soon.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Jane Doe"
                  className={inputClasses}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="mt-1.5 text-sm text-error">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className={inputClasses}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1.5 text-sm text-error">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="How can we help?"
                  className={`${inputClasses} resize-none`}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p className="mt-1.5 text-sm text-error">{errors.message}</p>}
              </div>

              <Button type="submit" size="lg" fullWidth>
                Send message
              </Button>
            </>
          )}
        </form>

        {/* Contact info */}
        <div className="card md:col-span-2 space-y-6 p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-text-primary">Other ways to reach us</h2>

          <div className="flex items-start gap-4">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-dark">
              <Phone className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">Phone</p>
              <p className="mt-0.5 text-sm text-text-secondary">+91 1234567890</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-dark">
              <MapPin className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-primary">Address</p>
              <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">
                123 Learning Street, Knowledge City, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
