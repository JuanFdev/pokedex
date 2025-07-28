import { useEffect, useState } from 'react';
import PokemonCard from './components/PokemonCard';
import SearchBar from './components/SearchBar';
import PokemonDetail from './components/PokemonDetail';
import BackToTopButton from './components/BackToTopButton';

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false); // ← nuevo estado

  useEffect(() => {
    fetchMorePokemon();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (nearBottom && !loading && !searching) {
        fetchMorePokemon();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, searching]);

  const fetchMorePokemon = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
      const data = await response.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return await res.json();
        })
      );

      const updatedList = [...pokemonList, ...pokemonDetails];
      setPokemonList(updatedList);
      setFilteredList(updatedList);
      setOffset(offset + 20);
    } catch (err) {
      console.error('Error cargando Pokémon:', err);
    }
    setLoading(false);
  };

  const handleSearch = async (term) => {
    const trimmed = term.trim().toLowerCase();
    if (!trimmed) {
      setFilteredList(pokemonList);
      setSearching(false);
      setNotFound(false);
      return;
    }

    setSearching(true);
    setNotFound(false);

    // Buscar en los cargados primero
    const localFiltered = pokemonList.filter((pokemon) => {
      const nameMatch = pokemon.name.toLowerCase().includes(trimmed);
      const typeMatch = pokemon.types.some((t) =>
        t.type.name.toLowerCase().includes(trimmed)
      );
      return nameMatch || typeMatch;
    });

    if (localFiltered.length > 0) {
      setFilteredList(localFiltered);
      return;
    }

    // Si no se encuentra localmente, intentar búsqueda directa por nombre
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${trimmed}`);
      if (!res.ok) throw new Error();
      const data = await res.json();

      setFilteredList([data]);
    } catch {
      setFilteredList([]);
      setNotFound(true); // ← mostrar mensaje
    }
  };

  const handleClick = async (name) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    setSelectedPokemon(data);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl text-center font-bold text-white mb-4">Pokédex</h1>

      <SearchBar onSearch={handleSearch} />

      {notFound && (
        <p className="text-center text-red-400 mt-4">No se encontró el Pokémon</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
        {filteredList.map((pokemon) => (
          <div
            key={pokemon.id}
            onClick={() => handleClick(pokemon.name)}
            className="cursor-pointer"
          >
            <PokemonCard pokemon={pokemon} />
          </div>
        ))}
      </div>

      {loading && !searching && (
        <p className="text-center text-white mt-6">Cargando más Pokémon...</p>
      )}

      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}

      <BackToTopButton />
    </div>
  );
}
