'use client';

import React from 'react';

type VideoItem = {
    title: string;
    duration: string;
    type: 'video' | 'assignment';
    isCurrent?: boolean;  // ✅ Optional
    dueDate?: string;     // ✅ Optional
  };
  

type Section = {
  name: string;
  items: VideoItem[];
};

type Props = {
  sections: Section[];
  onItemClick: (item: VideoItem) => void;
};

const CourseSectionList: React.FC<Props> = ({ sections, onItemClick }) => {
  return (
    <aside className="w-64 border-r border-gray-200 p-4 overflow-y-auto h-screen">
      <h2 className="text-lg font-semibold mb-2">Course Content</h2>
      <p className="text-sm text-gray-500 mb-4">Introduction to UX Design</p>

      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Section {sectionIdx + 1}: {section.name}
          </h3>

          <ul className="space-y-1">
            {section.items.map((item, idx) => (
              <li
                key={idx}
                onClick={() => onItemClick(item)}
                className={`p-2 rounded cursor-pointer ${
                  item.isCurrent ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{item.title}</span>
                  <span className="text-xs text-gray-500">{item.duration}</span>
                </div>
                {item.type === 'assignment' && item.dueDate && (
                  <p className="text-xs text-blue-500">Due: {item.dueDate}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default CourseSectionList;
