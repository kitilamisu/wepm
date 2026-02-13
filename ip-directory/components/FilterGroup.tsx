import React from 'react';
import { Check } from 'lucide-react';

interface FilterGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (option: string) => void;
  colorTheme?: 'green' | 'blue' | 'purple';
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, options, selected, onChange, colorTheme = 'green' }) => {
  
  const getColors = () => {
    switch(colorTheme) {
      case 'blue': return 'bg-blue-600 border-blue-500 text-white';
      case 'purple': return 'bg-purple-600 border-purple-500 text-white';
      default: return 'bg-emerald-600 border-emerald-500 text-white';
    }
  };

  const getHoverColors = () => {
    switch(colorTheme) {
      case 'blue': return 'hover:border-blue-500 hover:text-blue-400';
      case 'purple': return 'hover:border-purple-500 hover:text-purple-400';
      default: return 'hover:border-emerald-500 hover:text-emerald-400';
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
        {title}
        {selected.length > 0 && (
          <span className="bg-gray-700 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {selected.length}
          </span>
        )}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`
                text-xs px-3 py-1.5 rounded border transition-all duration-200 flex items-center gap-1.5
                ${isSelected 
                  ? getColors() 
                  : `bg-gray-800 border-gray-700 text-gray-400 ${getHoverColors()}`
                }
              `}
            >
              {isSelected && <Check size={12} />}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterGroup;