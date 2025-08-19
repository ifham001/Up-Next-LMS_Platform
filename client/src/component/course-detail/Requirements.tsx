'use client';
import React from 'react';

const staticRequirements = [
  'Basic computer knowledge and familiarity with using the internet',
  'No prior programming experience required - this course is suitable for complete beginners',
  'A computer with internet access (Windows, Mac, or Linux)',
  'Enthusiasm and determination to learn web development',
];
interface Props {
  requirements:string[]
}

const Requirements = ({requirements}:Props) => {
  return (
    <div className="space-y-1">
      <h3 className="text-xl font-semibold">Requirements</h3>
      <ul className="list-disc list-inside text-gray-700">
        {requirements.length >0 ?requirements.map((req, index) => (
          <li key={index}>{req}</li>
        )):staticRequirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
    </div>
  );
};

export default Requirements;