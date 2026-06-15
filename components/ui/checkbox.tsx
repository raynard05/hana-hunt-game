import React from 'react';

export const Checkbox = React.forwardRef<HTMLInputElement, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={`w-4 h-4 rounded border-[#D4A574]/40 text-[#D4A574] focus:ring-0 focus:ring-offset-0 bg-[#2B1D17]/40 cursor-pointer accent-[#D4A574] ${className}`}
        {...props}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';
