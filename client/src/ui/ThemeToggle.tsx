"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

// Aurora Bento is dark by default; "light" is the opt-in frosted variant
// applied via [data-theme="light"]. Absence of the attribute = dark.
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? null;
    const initial: Theme = stored ?? "dark"; // default to the dark aurora
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
  };

  if (!mounted) {
    return (
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${className}`}
        aria-hidden
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`group inline-flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary cursor-pointer ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-90" />
      ) : (
        <Moon className="h-[18px] w-[18px] transition-transform duration-500 group-hover:-rotate-12" />
      )}
    </button>
  );
}
