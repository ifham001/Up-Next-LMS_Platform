'use client';
import React from 'react';

const learningPoints = [
  'Build responsive websites with HTML5 and CSS3',
  'Create dynamic web applications with JavaScript',
  'Develop full-stack applications with React and Node.js',
  'Work with databases like MongoDB and MySQL',
  'Deploy your applications to production environments',
  'Implement authentication and security best practices',
];
interface Props {
  benefits:string[]
}

const YouWillLearn = ({benefits}:Props) => {
  
  return (
    <div className="bg-gray-50 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-2">
      {benefits.length >0 ?benefits.map((point, index) => (
        <div key={index} className="flex items-start gap-2">
          <span className="text-green-600 font-bold">✓</span>
          <p>{point}</p>
        </div>
      )):learningPoints.map((point, index) => (
        <div key={index} className="flex items-start gap-2">
          <span className="text-green-600 font-bold">✓</span>
          <p>{point}</p>
        </div>
      ))}
    </div>
  );
};

export default YouWillLearn;