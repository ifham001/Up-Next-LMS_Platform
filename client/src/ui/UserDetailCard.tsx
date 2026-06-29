"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { GraduationCap, IndianRupee, Mail, ChevronDown, ChevronUp } from "lucide-react";

// ----------------------
// Types
// ----------------------
export type UserDetailCardProps = {
  name: string;
  email: string;
  coursesBought: number; // how many courses they have purchased
  lifetimePurchaseAmount: number; // total value spent
  courses?: string[]; // list of course names
  avatarUrl?: string;
  currency?: string; // default: INR
};

// ----------------------
// Helpers
// ----------------------
const formatCurrency = (
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const initials = (name?: string) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

// ----------------------
// Component
// ----------------------
export default function UserDetailCard({
  name,
  email,
  coursesBought,
  lifetimePurchaseAmount,
  courses = [],
  avatarUrl,
  currency = "INR",
}: UserDetailCardProps) {
  const [showCourses, setShowCourses] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card w-full max-w-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-row items-center gap-4 p-6 border-b border-border">
        <div className="flex items-center justify-center size-14 rounded-full border border-border surface-muted text-text-primary text-lg font-semibold shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="size-14 rounded-full object-cover"
            />
          ) : (
            <span>{initials(name)}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold tracking-tight leading-tight text-text-primary truncate">{name}</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
            <Mail className="size-4 text-text-muted shrink-0" strokeWidth={1.75} />
            <span className="truncate">{email}</span>
          </div>
        </div>
      </div>

      {/* Content — bento stat tiles */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Stat
          icon={<GraduationCap className="size-5" strokeWidth={1.75} />}
          label="Courses purchased"
          value={coursesBought}
        />

        <Stat
          icon={<IndianRupee className="size-5" strokeWidth={1.75} />}
          label="Lifetime spend"
          value={formatCurrency(lifetimePurchaseAmount, currency)}
        />
      </div>

      {/* Expandable Courses */}
      {coursesBought > 0 && (
        <div className="px-6 pb-6">
          <button
            onClick={() => setShowCourses(!showCourses)}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {showCourses ? <ChevronUp className="size-4" strokeWidth={1.75} /> : <ChevronDown className="size-4" strokeWidth={1.75} />}
            {showCourses ? "Hide courses" : "Show courses"}
          </button>

          {showCourses && (
            <ul className="mt-3 flex flex-col gap-2 animate-fadeInUp">
              {courses.length > 0 ? (
                courses.map((course, idx) => (
                  <li
                    key={idx}
                    className="surface-muted border border-border rounded-md px-4 py-2.5 text-sm text-text-secondary"
                  >
                    {course}
                  </li>
                ))
              ) : (
                <li className="text-sm text-text-muted">No course names available</li>
              )}
            </ul>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ----------------------
// Subcomponents
// ----------------------
function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="surface-muted border border-border rounded-md flex items-center gap-3 p-4">
      <div className="grid place-items-center rounded-full border border-border size-10 bg-surface text-text-secondary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-text-muted">{label}</div>
        <div className="font-display tnum text-lg font-semibold leading-tight truncate text-text-primary">{value}</div>
      </div>
    </div>
  );
}

