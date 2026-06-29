'use client';

import React from 'react';
import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

const socials = [
  { label: 'Twitter', Icon: Twitter, href: '#' },
  { label: 'Facebook', Icon: Facebook, href: '#' },
  { label: 'Instagram', Icon: Instagram, href: '#' },
  { label: 'LinkedIn', Icon: Linkedin, href: '#' },
];

const exploreLinks = [
  { label: 'Courses', href: '/explore' },
  { label: 'Instructors', href: '/instructors' },
  { label: 'Resources', href: '/resources' },
];

const companyLinks = [
  { label: 'About', href: '/about-us' },
  { label: 'Contact', href: '/contact-us' },
  { label: 'Privacy', href: '/privacy-policy' },
];

const sectionLabel =
  'font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border bg-surface-muted">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand + blurb */}
          <div className="lg:col-span-6 space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span
                className="flex size-9 items-center justify-center rounded-xl bg-brand font-display text-lg font-bold text-white transition-transform duration-200 group-hover:-translate-y-px"
                style={{ boxShadow: 'var(--shadow-brand)' }}
              >
                ↑
              </span>
              <span className="font-display text-[22px] font-bold tracking-tight text-text-primary">
                UpNext
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
              Online courses taught by working practitioners. Learn at your own pace
              and keep track of everything you complete.
            </p>
            <div className="flex gap-2 pt-1">
              {socials.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-text-muted transition-colors hover:border-brand hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className={sectionLabel}>Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-muted transition-colors hover:text-brand-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className={sectionLabel}>Company</h4>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-muted transition-colors hover:text-brand-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-text-muted sm:flex-row">
          <p>© 2025 UpNext. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="transition-colors hover:text-brand-dark">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-brand-dark">
              Privacy
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-brand-dark">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
