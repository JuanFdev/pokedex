import { useEffect, useState } from 'react';

export default function PokemonCard({ pokemon }) {
  const [spanishName, setSpanishName] = useState('');
  const [spanishTypes, setSpanishTypes] = useState([]);

  useEffect(() => {
    async function fetchSpanishData() {
      try {
        const speciesRes = await fetch(pokemon.species.url);
        const speciesData = await speciesRes.json();
        const spanish = speciesData.names.find(n => n.language.name === 'es');
        setSpanishName(spanish ? spanish.name : pokemon.name);

        const translatedTypes = await Promise.all(
          pokemon.types.map(async (t) => {
            const typeRes = await fetch(t.type.url);
            const typeData = await typeRes.json();
            const spanishType = typeData.names.find(n => n.language.name === 'es');
            return {
              name: spanishType ? spanishType.name : t.type.name,
              original: t.type.name
            };
          })
        );

        setSpanishTypes(translatedTypes);
      } catch (err) {
        console.error('Error al traducir:', err);
        setSpanishName(pokemon.name);
        setSpanishTypes(
          pokemon.types.map(t => ({
            name: t.type.name,
            original: t.type.name
          }))
        );
      }
    }

    fetchSpanishData();
  }, [pokemon]);

  const typeColors = {
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-400 text-black',
    bug: 'bg-lime-500 text-black',
    poison: 'bg-purple-500',
    normal: 'bg-gray-400 text-black',
    ground: 'bg-yellow-600',
    fairy: 'bg-pink-400 text-black',
    fighting: 'bg-red-700',
    psychic: 'bg-pink-600',
    rock: 'bg-yellow-700',
    ghost: 'bg-indigo-700',
    dragon: 'bg-indigo-500',
    ice: 'bg-blue-300 text-black',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    flying: 'bg-blue-200 text-black'
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300">
      <img
        src={pokemon.sprites.front_default}
        alt={spanishName}
        className="w-20 h-20 mx-auto"
      />
      <h3 className="text-center text-lg capitalize mt-3 font-semibold">{spanishName}</h3>
      <p className="text-center text-sm text-gray-400 mb-2">
        N.º {pokemon.id.toString().padStart(3, '0')}
      </p>

      <div className="flex justify-center gap-2 flex-wrap mb-2">
        {spanishTypes.map((type, idx) => (
          <span
            key={idx}
            className={`px-2 py-1 text-sm rounded-full capitalize ${typeColors[type.original] || 'bg-gray-600'}`}
          >
            {type.name}
          </span>
        ))}
      </div>

      <div className="text-xs text-center text-gray-300">
        <p>Altura: {(pokemon.height / 10).toFixed(1)} m</p>
        <p>Peso: {(pokemon.weight / 10).toFixed(1)} kg</p>
      </div>
    </div>
  );
}
