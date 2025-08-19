'use client';

import React from 'react';

type Option = {
  label: string;
  value: string;
};

type Props = {
  question: string;
  options: Option[];
  name: string; // for grouping radio buttons
  selectedValue?: string;
  onChange: (value: string) => void;
};

const QuestionWithOptions: React.FC<Props> = ({
  question,
  options,
  name,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <p className="text-lg font-medium mb-3">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="accent-blue-500"
              required
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionWithOptions;
