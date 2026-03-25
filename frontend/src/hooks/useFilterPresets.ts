import { useState, useCallback } from 'react';
import type { TaskFilters } from '../types';

const STORAGE_KEY = 'task-filter-presets';

export interface FilterPreset {
  name: string;
  filters: TaskFilters;
  createdAt: string;
}

const loadPresets = (): FilterPreset[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FilterPreset[]) : [];
  } catch {
    return [];
  }
};

const persistPresets = (presets: FilterPreset[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
};

export const useFilterPresets = () => {
  const [presets, setPresets] = useState<FilterPreset[]>(loadPresets);

  const savePreset = useCallback((name: string, filters: TaskFilters) => {
    setPresets((prev) => {
      const without = prev.filter((p) => p.name !== name);
      const updated = [
        ...without,
        { name, filters, createdAt: new Date().toISOString() },
      ];
      persistPresets(updated);
      return updated;
    });
  }, []);

  const deletePreset = useCallback((name: string) => {
    setPresets((prev) => {
      const updated = prev.filter((p) => p.name !== name);
      persistPresets(updated);
      return updated;
    });
  }, []);

  const getPreset = useCallback(
    (name: string): TaskFilters | undefined => {
      return presets.find((p) => p.name === name)?.filters;
    },
    [presets]
  );

  return { presets, savePreset, deletePreset, getPreset };
};
