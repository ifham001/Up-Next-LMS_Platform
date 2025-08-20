import Button from '@/ui/Button';
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
    <form onSubmit={handleSubmit} className="flex items-start gap-2 w-full">
      {/* Avatar */}
      <div className="bg-purple-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
        {userName.charAt(0).toUpperCase()}
      </div>

      {/* Input */}
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
          rows={2}
        />
        <Button
          type="submit"
          className="mt-1 px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
        >
          Post
        </Button>
      </div>
    </form>
  );
}
