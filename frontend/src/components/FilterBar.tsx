import { useEffect, useRef, useState } from 'react';
import { Search, Bookmark, X, BookmarkCheck } from 'lucide-react';
import { Input, Select, Button } from './ui';
import type { FilterPreset } from '../hooks/useFilterPresets';
import type { TaskFilters } from '../types';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  presets: FilterPreset[];
  onSavePreset: (name: string, filters: TaskFilters) => void;
  onDeletePreset: (name: string) => void;
  onApplyPreset: (preset: FilterPreset) => void;
}

const hasActiveFilters = (f: TaskFilters) =>
  Boolean(f.status || f.priority || f.search);

export const FilterBar = ({
  filters,
  onChange,
  presets,
  onSavePreset,
  onDeletePreset,
  onApplyPreset,
}: FilterBarProps) => {
  const [searchValue, setSearchValue] = useState(filters.search ?? '');
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [presetName, setPresetName] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchValue(filters.search ?? '');
  }, [filters.search]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ ...filters, search: value || undefined });
    }, 300);
  };

  const handleStatusChange = (status: string) => {
    onChange({ ...filters, status: status || undefined });
  };

  const handlePriorityChange = (priority: string) => {
    onChange({ ...filters, priority: priority || undefined });
  };

  const handleClearAll = () => {
    setSearchValue('');
    setShowPresetInput(false);
    setPresetName('');
    onChange({});
  };

  const handleSavePreset = () => {
    const name = presetName.trim();
    if (!name) return;
    onSavePreset(name, filters);
    setPresetName('');
    setShowPresetInput(false);
  };

  const active = hasActiveFilters(filters);

  return (
    <div className="space-y-3">
      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search tasks…"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Status */}
        <div className="w-full sm:w-40">
          <Select
            value={filters.status ?? ''}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-10 py-2"
          >
            <option value="">All statuses</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Select>
        </div>

        {/* Priority */}
        <div className="w-full sm:w-40">
          <Select
            value={filters.priority ?? ''}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="h-10 py-2"
          >
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          {active && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPresetInput((v) => !v)}
              title="Save current filters as preset"
              className="h-10 w-10 p-0 flex items-center justify-center"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          )}
          {active && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              title="Clear all filters"
              className="h-10 w-10 p-0 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Save-preset input */}
      {showPresetInput && (
        <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-150">
          <Input
            type="text"
            placeholder="Name this preset…"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSavePreset();
              if (e.key === 'Escape') {
                setShowPresetInput(false);
                setPresetName('');
              }
            }}
            className="flex-1 h-10"
            autoFocus
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSavePreset}
            disabled={!presetName.trim()}
            className="h-10 px-4 whitespace-nowrap flex-shrink-0"
          >
            Save
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowPresetInput(false);
              setPresetName('');
            }}
            className="h-10 px-4 flex-shrink-0"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Preset chips */}
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5" />
            Saved:
          </span>
          {presets.map((preset) => (
            <button
              key={preset.name}
              className="group inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow"
              onClick={() => onApplyPreset(preset)}
              title={`Apply preset: ${preset.name}`}
            >
              <Bookmark className="w-3 h-3" />
              {preset.name}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePreset(preset.name);
                }}
                className="ml-0.5 rounded p-0.5 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title={`Delete preset: ${preset.name}`}
              >
                <X className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
