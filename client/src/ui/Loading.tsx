import React from "react";

interface LoadingProps {
  size?: number; // size in px
  color?: string; // tailwind or custom color
  text?: string; // optional loading text
}

const Loading: React.FC<LoadingProps> = ({
  size = 40,
  color = "text-[var(--color-brand)]",
  text,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
        style={{ width: size, height: size }}
      ></div>
      {text && <p className="text-sm text-[var(--color-text-secondary)]">{text}</p>}
    </div>
  );
};

export default Loading;
