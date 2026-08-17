import React from 'react';

function SearchBar({ value, onChange, placeholder = 'Search projects...' }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
