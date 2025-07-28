import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value);
  };

  return (
    <div className="w-full">
      <label htmlFor="search" className="sr-only">Buscar Pokémon</label> {/* NUEVO: Accesibilidad */}
      <input
        id="search"
        type="text"
        placeholder="Buscar Pokémon..."
        value={term}
        onChange={handleChange}
        className="w-full p-3 rounded-md border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}
