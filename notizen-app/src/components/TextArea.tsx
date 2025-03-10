import React, { forwardRef } from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = false, className = "", ...props }, ref) => {
    const baseClasses =
      "rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
    const errorClasses = error ? "border-red-500" : "border-gray-300";
    const widthClass = fullWidth ? "w-full" : "";
    const classes = `${baseClasses} ${errorClasses} ${widthClass} ${className}`;

    return (
      <div className={`mb-4 ${widthClass}`}>
        {label && (
          <label className="block text-gray-700 font-medium mb-1">
            {label}
          </label>
        )}
        <textarea ref={ref} className={classes} {...props} />
        {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
