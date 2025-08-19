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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg rounded-2xl shadow-sm border bg-white"
    >
      {/* Header */}
      <div className="flex flex-row items-center gap-4 p-6 border-b">
        <div className="flex items-center justify-center size-14 rounded-full bg-gray-100 font-semibold text-lg">
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

        <div className="flex-1">
          <h2 className="text-xl font-semibold leading-tight">{name}</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <Mail className="size-4" />
            <span className="truncate">{email}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Stat
          icon={<GraduationCap className="size-5" />}
          label="Courses Purchased"
          value={coursesBought}
        />

        <Stat
          icon={<IndianRupee className="size-5" />}
          label="Lifetime Spend"
          value={formatCurrency(lifetimePurchaseAmount, currency)}
        />
      </div>

      {/* Expandable Courses */}
      {coursesBought > 0 && (
        <div className="px-6 pb-6">
          <button
            onClick={() => setShowCourses(!showCourses)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            {showCourses ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            {showCourses ? "Hide Courses" : "Show Courses"}
          </button>

          {showCourses && (
            <ul className="mt-3 list-disc list-inside text-sm text-gray-700 space-y-1">
              {courses.length > 0 ? (
                courses.map((course, idx) => <li key={idx}>{course}</li>)
              ) : (
                <li>No course names available</li>
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
    <div className="flex items-center gap-3 rounded-2xl border bg-gray-50 p-4">
      <div className="grid place-items-center rounded-xl border size-10 bg-white">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-lg font-semibold leading-tight truncate">{value}</div>
      </div>
    </div>
  );
}

// ----------------------
// Example usage (remove in production)
// ----------------------

