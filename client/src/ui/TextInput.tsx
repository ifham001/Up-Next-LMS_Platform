import React, { useState } from "react";

interface BaseProps {
  label: string;
  state: [string, React.Dispatch<React.SetStateAction<string>>];
  required?: boolean;
  textarea?: boolean; // if true, render a textarea
}

type TextInputProps =
  | (BaseProps & React.InputHTMLAttributes<HTMLInputElement> & { textarea?: false })
  | (BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { textarea: true });

const TextInput: React.FC<TextInputProps> = ({
  label,
  state,
  required,
  textarea = false,
  ...props
}) => {
  const [value, setValue] = state;
  const [touched, setTouched] = useState(false);

  const showError = required && touched && value.trim() === "";

  const commonClasses = `px-3 py-2 rounded-lg focus:outline-none
    bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
    border ${
      showError
        ? "border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]"
        : "border-[var(--color-input-border)] focus:ring-2 focus:ring-[var(--color-brand)]"
    }
  `;

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label} {required && <span style={{ color: "var(--color-error)" }}>*</span>}
      </label>

      {textarea ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          className={commonClasses + " min-h-[100px] resize-none"}
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          className={commonClasses}
        />
      )}

      {showError && (
        <p className="text-xs text-[var(--color-error)]">This field is required.</p>
      )}
    </div>
  );
};

export default TextInput;
