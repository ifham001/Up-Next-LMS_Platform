import React from "react";

interface LoadingProps {
  size?: number; // size in px
  color?: string; // kept for API compatibility
  text?: string; // optional loading text
}

const Loading: React.FC<LoadingProps> = ({
  size = 40,
  text,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div
        className="animate-spin rounded-full border-2 border-brand-50 border-t-brand"
        style={{ width: size, height: size }}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-sm text-text-muted leading-relaxed">{text}</p>}
    </div>
  );
};

export default Loading;
