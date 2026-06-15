import React from 'react';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm font-medium text-[#FFF8E1] select-none ${className}`}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';
