import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }: SearchInputProps) => {
  return (
    <div className={`relative group ${className}`}>
      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm font-semibold bg-white/60 hover:bg-white focus:bg-white text-slate-800 border border-slate-200/80 rounded-xl pl-11 pr-4 py-3 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm"
      />
    </div>
  );
};

export { SearchInput };
export default SearchInput;
