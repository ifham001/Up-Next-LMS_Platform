'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  title: string;
  count: number;
  onChange: (values: string[]) => void;
};

const InputGroup: React.FC<Props> = ({ title, count, onChange }) => {
  const [inputs, setInputs] = useState<string[]>(Array(count).fill(''));
  const [touched, setTouched] = useState<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    onChange(inputs);
  }, [inputs, onChange]);

  const handleChange = (index: number, value: string) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
  };

  const handleBlur = (index: number) => {
    const updated = [...touched];
    updated[index] = true;
    setTouched(updated);
  };

  const showError = (index: number) => inputs[index].trim() === '' && touched[index];

  const inputClass = (index: number) =>
    `px-4 py-3 rounded-md text-sm sm:text-base focus:outline-none w-full
     bg-input-bg text-text-primary placeholder:text-input-placeholder
     border transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
       showError(index)
         ? 'border-error focus-visible:ring-error/40'
         : 'border-input-border hover:border-border-strong focus-visible:ring-accent/40'
     }`;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold tracking-tight text-text-primary mb-4">{title}</h3>
      <div className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
              {title} {index + 1}
            </label>
            <input
              value={inputs[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onBlur={() => handleBlur(index)}
              placeholder={`Enter ${title.toLowerCase()} ${index + 1}`}
              className={inputClass(index)}
              required
            />
            {showError(index) && (
              <p className="text-xs text-error">
                This field is required.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputGroup;
