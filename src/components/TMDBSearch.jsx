// src/components/TMDBSearch.jsx
import { useState } from "react";

const TMDB_API_KEY = "b4ba1cfe41c5fa80592d5362caa96b2f"; // reemplazá con tu API Key real

export default function TMDBSearch({ onVideoAdded, onSelectResult }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchTMDB = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&language=es`
    );
    const data = await res.json();
    setResults(data.results || []);
  };

  const handleSelect = (item) => {
    const isMovie = item.media_type === "movie";
    const isTV = item.media_type === "tv";

    const video = {
      title: item.title || item.name,
      image_url: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "",
      video_url: "",
      category: isMovie ? "Cine" : isTV ? "Series" : "Otros",
    };

    if (onSelectResult) {
      onSelectResult(video);
    }
  };

  return (
    <div>
      <form onSubmit={searchTMDB} className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Buscar en TMDB..."
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 px-4 rounded hover:bg-blue-700">
          Buscar
        </button>
      </form>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {results.map((item) => (
          <div
            key={item.id}
            className="bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-600"
            onClick={() => handleSelect(item)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
              alt={item.title || item.name}
              className="w-full h-32 object-cover rounded"
            />
            <p className="text-sm mt-1 text-white truncate">
              {item.title || item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
