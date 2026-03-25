import { InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    const baseStyles = 'w-full rounded-lg shadow-sm px-3 py-2 border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-offset-slate-900';
    
    const stateStyles = error
      ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:text-red-400 dark:border-red-500'
      : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500';
    
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={twMerge(clsx(baseStyles, stateStyles, className))}
          {...props}
        />
        {error && (
          <p className="text-red-600 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
