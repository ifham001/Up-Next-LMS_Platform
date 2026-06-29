'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Button from '@/ui/Button';

const inputClasses =
  "w-full rounded-lg border border-input-border bg-input-bg px-3.5 py-2.5 text-sm text-text-primary " +
  "placeholder:text-input-placeholder " +
  "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 " +
  "transition-colors duration-150";

const contactInfo = [
  { Icon: Mail, label: 'Email', value: 'support@lms.com' },
  { Icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
  { Icon: MapPin, label: 'Address', value: '123 Learning St, Education City' },
];

type FormState = { firstName: string; lastName: string; email: string; message: string };
type Errors = Partial<Record<keyof FormState, string>>;

const ContactUs = () => {
  const [form, setForm] = useState<FormState>({ firstName: '', lastName: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.firstName.trim()) next.firstName = 'Enter your first name.';
    if (!form.email.trim()) next.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.message.trim()) next.message = 'Tell us how we can help.';

    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 max-w-2xl animate-fadeInUp">
          <span className="eyebrow">Get in touch</span>
          <h2 className="display mt-3 text-3xl font-semibold text-text-primary md:text-4xl">
            Contact <span className="text-accent">us</span>
          </h2>
          <p className="mt-3 max-w-[65ch] leading-relaxed text-text-secondary">
            Have a question or feedback? Fill out the form and we will get back to you within
            a couple of business days.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 animate-fadeInUp delay-1">
          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="card lg:col-span-3 space-y-5 p-6 sm:p-8">
            {submitted ? (
              <div className="py-8 text-center">
                <h3 className="text-lg font-semibold text-text-primary">Message sent</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
                  Thanks for reaching out. We will reply to {form.email} soon.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-text-secondary">
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={update('firstName')}
                      placeholder="Jane"
                      className={inputClasses}
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && <p className="mt-1.5 text-sm text-error">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-text-secondary">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={update('lastName')}
                      placeholder="Doe"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
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
                    onChange={update('message')}
                    placeholder="How can we help you?"
                    className={`${inputClasses} resize-none`}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="mt-1.5 text-sm text-error">{errors.message}</p>}
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Send message
                </Button>
              </>
            )}
          </form>

          {/* Contact info */}
          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            {contactInfo.map(({ Icon, label, value }) => (
              <div key={label} className="card-interactive flex items-center gap-4 p-5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-dark">
                  <Icon strokeWidth={1.75} className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-medium text-text-primary">{label}</h3>
                  <p className="mt-0.5 text-sm text-text-secondary">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
