// src/components/SearchBar.tsx
import React, { useState } from 'react';
import './SearchBar.css';
import { validateSearchInput } from '../utils/validateSearch';

type Mode = 'title' | 'person' | 'company' | 'genre';


export type SearchParams = {
  mode: Mode;
  query: string;      // text or genre name
};

type Props = {
  onSearch: (params: SearchParams) => void;
  placeholder?: string;
  value: string;
  onChange: (newValue: string) => void;
};

const SearchBar: React.FC<Props> = ({ onSearch, placeholder, value, onChange }) => {
  const [mode, setMode] = useState<Mode>('title');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const searchTerm = value.trim();
    if (!searchTerm) return;
    onSearch({ mode, query: searchTerm });
    // optional: clear after searching
    // onChange('');
  }

  return (
    <form className="searchbar" onSubmit={submit}>
      <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
        <option value="title">Title</option>
        <option value="person">Actor / Creator</option>
        <option value="company">Publisher</option>
        <option value="genre">Genre</option>
      </select>

      <input
        type="text"
        value={value}
         onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
      />

      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
