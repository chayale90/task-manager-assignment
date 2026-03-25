import { SearchX } from 'lucide-react';
import { Button } from './ui';

interface NoResultsStateProps {
  onClearFilters: () => void;
}

export const NoResultsState = ({ onClearFilters }: NoResultsStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
      <SearchX className="w-7 h-7 text-slate-400 dark:text-slate-500" />
    </div>
    <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-1">
      No tasks match your filters
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Try adjusting your search or filters.
    </p>
    <Button variant="secondary" size="sm" onClick={onClearFilters}>
      Clear filters
    </Button>
  </div>
);
