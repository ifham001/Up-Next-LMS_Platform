import React, { useState } from 'react';

type Props = {
  userName: string;
  onAdd: (text: string) => void;
  placeholder?: string;
};

export default function AddComment({ userName, onAdd, placeholder = 'Write a comment...' }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-start gap-3">
      {/* Avatar */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-text-primary">
        {userName.charAt(0).toUpperCase()}
      </div>

      {/* Input */}
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none rounded-lg border border-input-border bg-input-bg p-3 text-sm text-text-primary placeholder:text-input-placeholder transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          rows={2}
        />
        <button
          type="submit"
          className="btn-primary mt-2 inline-flex items-center justify-center px-5 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          Post
        </button>
      </div>
    </form>
  );
}
