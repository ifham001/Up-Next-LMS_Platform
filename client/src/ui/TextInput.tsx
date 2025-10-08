import React, { useState } from "react";

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

  const commonClasses = `w-full px-4 py-2.5 rounded-md text-sm sm:text-base
    bg-gray-50 text-gray-700 placeholder:text-gray-400
    border transition-colors duration-200
    focus:outline-none
    ${
      showError
        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
        : "border-gray-300 focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent hover:border-[#8c52ff]"
    }
  `;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
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
        <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          This field is required.
        </p>
      )}
    </div>
  );
};

export default TextInput;