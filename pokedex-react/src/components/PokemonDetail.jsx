import { useEffect, useState } from 'react';

export default function PokemonDetail({ pokemon, onClose }) {
  const [spanishName, setSpanishName] = useState('');
  const [spanishTypes, setSpanishTypes] = useState([]);
  const [spanishAbilities, setSpanishAbilities] = useState([]);
  const [spanishStats, setSpanishStats] = useState([]);

  useEffect(() => {
    async function fetchSpanishData() {
      try {
        // Nombre en español
        const speciesRes = await fetch(pokemon.species.url);
        const speciesData = await speciesRes.json();
        const nameEs = speciesData.names.find(n => n.language.name === 'es');
        setSpanishName(nameEs ? nameEs.name : pokemon.name);

        // Tipos en español
        const translatedTypes = await Promise.all(
          pokemon.types.map(async (t) => {
            const res = await fetch(t.type.url);
            const data = await res.json();
            const typeEs = data.names.find(n => n.language.name === 'es');
            return typeEs ? typeEs.name : t.type.name;
          })
        );
        setSpanishTypes(translatedTypes);

        // Habilidades en español
        const translatedAbilities = await Promise.all(
          pokemon.abilities.map(async (a) => {
            const res = await fetch(a.ability.url);
            const data = await res.json();
            const abilityEs = data.names.find(n => n.language.name === 'es');
            return abilityEs ? abilityEs.name : a.ability.name;
          })
        );
        setSpanishAbilities(translatedAbilities);

        // Estadísticas en español
        const translatedStats = await Promise.all(
          pokemon.stats.map(async (s) => {
            const res = await fetch(s.stat.url);
            const data = await res.json();
            const statEs = data.names.find(n => n.language.name === 'es');
            return {
              name: statEs ? statEs.name : s.stat.name,
              value: s.base_stat
            };
          })
        );
        setSpanishStats(translatedStats);

      } catch (err) {
        console.error('Error al traducir detalles', err);
        setSpanishName(pokemon.name);
        setSpanishTypes(pokemon.types.map(t => t.type.name));
        setSpanishAbilities(pokemon.abilities.map(a => a.ability.name));
        setSpanishStats(pokemon.stats.map(s => ({ name: s.stat.name, value: s.base_stat })));
      }
    }

    fetchSpanishData();
  }, [pokemon]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 text-white p-6 rounded-lg w-full max-w-md relative">
        <button
          className="absolute top-3 right-4 text-xl text-white"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">{spanishName}</h2>
        <img
          src={pokemon.sprites.front_default}
          alt={spanishName}
          className="mx-auto mb-4"
        />

        <div className="mb-3">
          <strong>Tipos:</strong>
          <div className="flex gap-2 mt-1 flex-wrap">
            {spanishTypes.map((type, idx) => (
              <span key={idx} className="bg-blue-600 px-2 py-1 rounded-full text-sm capitalize">
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <strong>Habilidades:</strong>
          <ul className="list-disc list-inside mt-1">
            {spanishAbilities.map((ability, idx) => (
              <li key={idx} className="capitalize">{ability}</li>
            ))}
          </ul>
        </div>

        <div className="mb-3">
          <strong>Estadísticas Base:</strong>
          <ul className="mt-1">
            {spanishStats.map((stat, idx) => (
              <li key={idx} className="capitalize flex justify-between">
                <span>{stat.name}</span>
                <span>{stat.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
