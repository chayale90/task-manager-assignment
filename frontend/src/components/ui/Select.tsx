import { SelectHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, label, className, children, ...props }, ref) => {
    const baseStyles = 'w-full rounded-lg shadow-sm px-3 py-2.5 pr-10 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-offset-slate-900 cursor-pointer appearance-none bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600';
    
    const stateStyles = error
      ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500 dark:text-red-400 dark:border-red-500'
      : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500';
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={twMerge(clsx(baseStyles, stateStyles, className))}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500 dark:text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
