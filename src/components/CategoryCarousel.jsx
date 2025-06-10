import { useEffect, useState } from "react";

export default function CategoryCarousel({ category }) {
  const [items, setItems] = useState([]);
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(category)}&language=es-ES&page=1&include_adult=false`
        );
        const data = await res.json();
        setItems(data.results || []);
      } catch (err) {
        console.error("Error fetching from TMDb:", err);
        setItems([]);
      }
    };

    fetchMovies();
  }, [category]);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">{category}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[160px] max-w-[160px] bg-gray-800 rounded-lg shadow p-2 hover:scale-105 transition"
          >
            {item.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                alt={item.title}
                className="rounded mb-2 w-full"
              />
            ) : (
              <div className="h-[240px] bg-gray-700 mb-2 rounded" />
            )}
            <p className="text-sm font-medium text-white truncate">
              {item.title || "Sin título"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
