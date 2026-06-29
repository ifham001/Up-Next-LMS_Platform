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
    <aside className="card w-64 m-3 p-6 overflow-y-auto h-[calc(100vh-1.5rem)]">
      <h2 className="text-lg font-semibold tracking-tight text-text-primary mb-1">Course content</h2>
      <p className="text-sm text-text-muted mb-6">Introduction to UX Design</p>

      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="mb-7">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted mb-2.5">
            Section {sectionIdx + 1}: {section.name}
          </h3>

          <ul className="space-y-1">
            {section.items.map((item, idx) => (
              <li
                key={idx}
                onClick={() => onItemClick(item)}
                className={`p-2.5 rounded-md cursor-pointer border transition-colors duration-150 ${
                  item.isCurrent
                    ? 'border-brand bg-brand-50 text-brand-dark font-medium'
                    : 'border-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span>{item.title}</span>
                  <span className="tnum text-xs text-text-muted">{item.duration}</span>
                </div>
                {item.type === 'assignment' && item.dueDate && (
                  <p className="text-xs text-text-muted mt-0.5">Due: {item.dueDate}</p>
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
