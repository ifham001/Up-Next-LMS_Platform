'use client'
import { useState } from 'react'

interface Props {   
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function PopUpModal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto p-4">
      <div
        className="bg-white rounded-2xl p-6 relative shadow-xl overflow-auto max-h-[90vh]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
