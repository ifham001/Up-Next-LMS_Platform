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
    `px-3 py-2 rounded-lg focus:outline-none w-full
     bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
     border ${
       showError(index)
         ? 'border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]'
         : 'border-[var(--color-input-border)] focus:ring-2 focus:ring-[var(--color-brand)]'
     }`;

  return (
    <div className="mb-6">
      <p className="text-lg font-medium mb-3">{title}</p>
      <div className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <input
              value={inputs[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onBlur={() => handleBlur(index)}
              placeholder={`Enter ${title.toLowerCase()} ${index + 1}`}
              className={inputClass(index)}
              required
            />
            {showError(index) && (
              <p className="text-xs text-[var(--color-error)]">
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
