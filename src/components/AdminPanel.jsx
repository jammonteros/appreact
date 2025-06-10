// src/components/AdminPanel.jsx
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import TMDBSearch from "./TMDBSearch";

export default function AdminPanel() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    image_url: "",
    video_url: "",
    category: "",
  });

  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    if (error) console.error("Error al cargar videos:", error);
    else setVideos(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("videos").insert([form]);
    if (error) alert("Error al guardar");
    else {
      setForm({ title: "", image_url: "", video_url: "", category: "" });
      fetchVideos();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este contenido?")) {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) alert("Error al eliminar");
      else fetchVideos();
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>

      {/* Formulario manual */}
      <form onSubmit={handleSubmit} className="bg-gray-900 p-4 rounded space-y-3 max-w-md">
        <h2 className="text-xl font-semibold">Agregar manualmente</h2>
        <input
          className="w-full p-2 bg-gray-800 rounded"
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 bg-gray-800 rounded"
          type="text"
          name="image_url"
          placeholder="URL de imagen"
          value={form.image_url}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 bg-gray-800 rounded"
          type="text"
          name="video_url"
          placeholder="URL de video"
          value={form.video_url}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 bg-gray-800 rounded"
          type="text"
          name="category"
          placeholder="Categoría (Ej: Series, Cine)"
          value={form.category}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full">
          Guardar contenido
        </button>
      </form>

      {/* Buscador TMDB */}
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">Buscar en TMDB</h2>
        <TMDBSearch
          onVideoAdded={fetchVideos}
          onSelectResult={(video) => setForm(video)}
        />
      </div>

      {/* Lista de contenido */}
      <div>
        <h2 className="text-xl font-semibold mb-2 mt-6">Contenido cargado</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {videos.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded p-2 shadow">
              <img
                src={video.image_url}
                alt={video.title}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="text-sm font-semibold mt-2 truncate">{video.title}</h3>
              <p className="text-xs text-gray-400 truncate">{video.category}</p>
              <div className="flex gap-1 mt-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-xs px-2 py-1 rounded w-full"
                  onClick={() => alert("Editar próximamente")}
                >
                  📝
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 rounded w-full"
                  onClick={() => handleDelete(video.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
