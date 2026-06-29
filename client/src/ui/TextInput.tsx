import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

interface BaseProps {
  label: string;
  state: [string, React.Dispatch<React.SetStateAction<string>>];
  required?: boolean;
  textarea?: boolean;
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

  const commonClasses = `w-full px-4 py-3 rounded-md text-sm sm:text-base
    bg-input-bg text-text-primary placeholder:text-input-placeholder
    border transition-colors duration-150
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg
    ${
      showError
        ? "border-error focus-visible:ring-error/40"
        : "border-input-border focus-visible:ring-accent/40 hover:border-border-strong"
    }
  `;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text-secondary">
        {label} {required && <span className="text-error">*</span>}
      </label>

      {textarea ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          className={commonClasses + " min-h-[120px] resize-none"}
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
        <p className="text-xs sm:text-sm text-error flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          This field is required.
        </p>
      )}
    </div>
  );
};

export default TextInput;