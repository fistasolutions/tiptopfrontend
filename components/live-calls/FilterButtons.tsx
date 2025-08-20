import React from 'react';

interface FilterButton {
  label: string;
  value: string | null;
}

interface FilterButtonsProps {
  activeTab: string | null;
  setActiveTab: (value: string | null) => void;
  buttons: FilterButton[];
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ activeTab, setActiveTab, buttons }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1 flex space-x-1 overflow-x-auto mb-6">
      {buttons.map((button) => (
        <button 
          key={button.value || 'all'}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeTab === button.value 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
          onClick={() => setActiveTab(button.value)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons; 