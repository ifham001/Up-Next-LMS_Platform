'use client';
import React from 'react';
import { Check } from 'lucide-react';

const learningPoints = [
  'Build responsive websites with HTML5 and CSS3',
  'Create dynamic web applications with JavaScript',
  'Develop full-stack applications with React and Node.js',
  'Work with databases like MongoDB and MySQL',
  'Deploy your applications to production environments',
  'Implement authentication and security best practices',
];
interface Props {
  benefits: string[];
}

const YouWillLearn = ({ benefits }: Props) => {
  const points = benefits.length > 0 ? benefits : learningPoints;

  return (
    <section className="animate-fadeInUp space-y-5">
      <h2 className="display text-2xl text-text-primary">What you&apos;ll learn</h2>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3 leading-relaxed text-text-secondary">
            <Check
              strokeWidth={1.75}
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-success"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default YouWillLearn;
