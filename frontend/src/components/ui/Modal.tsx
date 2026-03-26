import { ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true));
      });
    } else {
      setAnimate(false);
      const timer = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = 'unset';
      }, 200);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={clsx(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200',
          animate ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />
      
      <div 
        className={twMerge(
          clsx(
            'relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto transition-all duration-200',
            animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )
        )}
      >
        <div className="sticky top-0 right-0 z-10 flex justify-end pt-4 pr-4 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1.5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 -mt-10">
          {title && (
            <div className="mb-4 pr-10">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            </div>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
};
