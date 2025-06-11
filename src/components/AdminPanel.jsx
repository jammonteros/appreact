// src/components/AdminPanel.jsx
import { useState, useEffect } from "react";
import TMDBSearch from "./TMDBSearch";
import  supabase  from "../supabaseClient";
import UserManager from "./UserManager"; // Importa el componente UserManager

export default function AdminPanel() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    video_url: "",
    image_url: "",
    description: "",
  });

  // Función para cargar los videos desde Supabase
  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select("*");
    if (error) {
      console.error("Error al cargar los videos:", error);
    } else {
      setVideos(data);
    }
  };

  // Función para agregar un nuevo video
  const addVideo = async () => {
    const { error } = await supabase.from("videos").insert([form]);
    if (error) {
      console.error("Error al agregar el video:", error);
    } else {
      setForm({
        title: "",
        category: "",
        video_url: "",
        image_url: "",
        description: "",
      });
      fetchVideos();
    }
  };

  // Función para eliminar un video
  const deleteVideo = async (id) => {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar el video:", error);
    } else {
      fetchVideos();
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-md shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">🛠️ Panel de Administración</h2>

      {/* Formulario para agregar un video */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-4">➕ Agregar Video</h3>
        <input
          placeholder="Título"
          className="p-2 bg-gray-700 rounded w-full mb-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Categoría"
          className="p-2 bg-gray-700 rounded w-full mb-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="URL del Video"
          className="p-2 bg-gray-700 rounded w-full mb-2"
          value={form.video_url}
          onChange={(e) => setForm({ ...form, video_url: e.target.value })}
        />
        <input
          placeholder="URL de la imagen"
          className="p-2 bg-gray-700 rounded w-full mb-2"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <textarea
          placeholder="Descripción"
          className="p-2 bg-gray-700 rounded w-full mb-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button
          onClick={addVideo}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2"
        >
          Agregar Video
        </button>
      </div>

      {/* Mostrar los videos */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-4">📦 Videos Cargados</h3>
        <ul className="space-y-2">
          {videos.map((video) => (
            <li
              key={video.id}
              className="flex justify-between items-center bg-gray-700 p-2 rounded-md"
            >
              <div className="text-white flex-1">
                <h4>{video.title}</h4>
                <p className="text-sm">{video.category}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => deleteVideo(video.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel de gestión de usuarios */}
      <UserManager />
    </div>
  );
}
