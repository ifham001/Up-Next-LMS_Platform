'use client';
import React from 'react';
import { Check } from 'lucide-react';

const staticRequirements = [
  'Basic computer knowledge and familiarity with using the internet',
  'No prior programming experience required, suitable for complete beginners',
  'A computer with internet access (Windows, Mac, or Linux)',
  'Time set aside each week to practice and build projects',
];
interface Props {
  requirements: string[];
}

const Requirements = ({ requirements }: Props) => {
  const items = requirements.length > 0 ? requirements : staticRequirements;

  return (
    <section className="animate-fadeInUp space-y-5">
      <h2 className="display text-2xl text-text-primary">Requirements</h2>
      <ul className="space-y-3">
        {items.map((req, index) => (
          <li
            key={index}
            className="flex items-start gap-3 leading-relaxed text-text-secondary"
          >
            <Check
              strokeWidth={1.75}
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand"
            />
            <span>{req}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Requirements;
