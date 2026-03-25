import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Users } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const MultiSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select members...',
  className,
  disabled = false,
  loading = false,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };

    const handleScrollOrResize = () => {
      if (open) updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [open, updatePosition]);

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const triggerLabel =
    value.length === 0
      ? placeholder
      : value.length === 1
      ? options.find((o) => o.value === value[0])?.label ?? placeholder
      : `${value.length} member${value.length > 1 ? 's' : ''} selected`;

  const dropdown = open && !disabled && !loading ? (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
    >
      {options.length === 0 ? (
        <div className="px-3 py-3 text-sm text-center text-slate-400 dark:text-slate-500">
          No team members available
        </div>
      ) : (
        <ul className="max-h-60 overflow-y-auto py-1">
          {options.map((option) => {
            const selected = value.includes(option.value);
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => toggle(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggle(option.value);
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:bg-indigo-50 dark:focus:bg-indigo-500/10"
                >
                  <span
                    className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 ${
                      selected
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {selected && <Check className="w-2.5 h-2.5 text-white" />}
                  </span>
                  <span className="truncate flex-1 text-left">{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  ) : null;

  return (
    <div className={twMerge('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && !loading && setOpen((prev) => !prev)}
        disabled={disabled || loading}
        className={twMerge(
          'w-full flex items-center justify-between rounded-lg shadow-sm px-3 py-2.5 border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900',
          disabled || loading
            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 cursor-pointer'
        )}
      >
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span className={value.length === 0 ? 'text-slate-400 dark:text-slate-500' : ''}>
            {loading ? 'Loading...' : triggerLabel}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {createPortal(dropdown, document.body)}
    </div>
  );
};
