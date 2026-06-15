import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={`w-full h-12 px-4 py-3 rounded-xl border border-[#D4A574]/30 bg-[#2B1D17]/40 text-[#FFF8E1] placeholder-[#D4A574]/50 focus:outline-none focus:border-[#D4A574] focus:ring-1 focus:ring-[#D4A574] transition-all duration-300 ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
