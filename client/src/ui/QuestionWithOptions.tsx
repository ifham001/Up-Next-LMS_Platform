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
    <div className="mb-8">
      <h3 className="text-lg font-semibold tracking-tight text-text-primary mb-4">{question}</h3>
      <div className="flex flex-col gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedValue === option.value;
          return (
            <label
              key={option.value}
              className={`group flex items-center gap-3 cursor-pointer rounded-md border px-4 py-3.5 transition-colors duration-150 animate-fadeInUp ${
                idx < 4 ? `delay-${idx + 1}` : ''
              } ${
                isSelected
                  ? 'border-brand bg-brand-50 text-brand-dark'
                  : 'border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-muted'
              }`}
            >
              <span
                className={`grid place-items-center size-5 shrink-0 rounded-full border transition-colors ${
                  isSelected
                    ? 'border-brand bg-brand'
                    : 'border-border-strong bg-transparent'
                }`}
              >
                {isSelected && <span className="size-2 rounded-full bg-text-inverted" />}
              </span>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
                required
              />
              <span className="font-medium">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionWithOptions;
