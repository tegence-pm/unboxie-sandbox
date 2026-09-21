import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface MultiSelectDropdownProps {
  label?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select categories...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left w-full sm:w-auto" ref={containerRef}>
      {label && (
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </span>
      )}

      {/* Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium rounded-xl border bg-white transition-all w-full sm:w-64 min-h-[38px] ${
          isOpen
            ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
            : selected.length > 0
            ? 'border-brand-300 text-slate-800'
            : 'border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate max-w-[200px]">
          {selected.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : selected.length === 1 ? (
            <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-semibold truncate">
              {selected[0]}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white text-[11px] font-bold">
              {selected.length} Categories Selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {selected.length > 0 && (
            <span
              onClick={clearAll}
              className="p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              title="Clear all"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-64 rounded-2xl bg-white p-2 shadow-modal border border-slate-200 z-50 animate-fade-in">
          {/* Search box inside dropdown */}
          <div className="mb-2 px-1">
            <input
              type="text"
              placeholder="Search options..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <p className="text-xs text-slate-400 p-2 text-center">No matching categories</p>
            ) : (
              filteredOptions.map(option => {
                const isSelected = selected.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-50 text-brand-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Footer Actions */}
          <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px] px-1">
            <button
              type="button"
              onClick={() => onChange(options)}
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-slate-500 hover:text-slate-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
