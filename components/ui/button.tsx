import React from 'react';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`w-full py-3 px-4 rounded-xl bg-[#D4A574] text-[#2B1D17] font-semibold hover:bg-[#E5B685] active:scale-95 transition-all duration-300 shadow-[0_4px_14px_rgba(212,165,116,0.3)] hover:shadow-[0_6px_20px_rgba(212,165,116,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D4A574] disabled:active:scale-100 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
