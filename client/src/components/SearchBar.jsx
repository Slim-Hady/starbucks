import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search drinks and food...' }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full max-w-md">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 rounded-pill bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sb-green text-sb-black placeholder-gray-400 transition"
      />
    </div>
  );
}
