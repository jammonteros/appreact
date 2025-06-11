import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import TMDBSearch from "./TMDBSearch";
import UserManager from "./UserManager";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirige si no es admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return navigate("/login");

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (!profile || profile.role !== "admin") navigate("/");
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    if (error) console.error("Error fetching videos:", error);
    else setVideos(data || []);
  };

  const deleteVideo = async (id) => {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (!error) fetchVideos();
  };

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Panel de Administración</h1>

      {/* Buscar video */}
      <input
        type="text"
        placeholder="Buscar videos..."
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Lista de videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
            <p className="text-sm text-gray-400 mb-1">{video.category}</p>
            <p className="text-sm mb-2">{video.description?.slice(0, 80)}...</p>
            <button
              onClick={() => deleteVideo(video.id)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* Buscador TMDB */}
      <div className="mt-10">
        <h2 className="text-2xl mb-2">Buscar y cargar contenido desde TMDB</h2>
        <TMDBSearch onContentUploaded={fetchVideos} />
      </div>

      {/* Gestión de usuarios */}
      <div className="mt-10">
        <h2 className="text-2xl mb-2">Gestión de Usuarios</h2>
        <UserManager />
      </div>
    </div>
  );
}
