import { HTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    const baseStyles = 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors duration-200';
    
    return (
      <div
        ref={ref}
        className={twMerge(clsx(baseStyles, className))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
