// src/components/StreamingApp.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import HeroBanner from "./HeroBanner";
import CategoryRow from "./CategoryRow";
import TopNavBar from "./TopNavBar";

export default function StreamingApp() {
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [videos, setVideos] = useState([]);
  const [groupedVideos, setGroupedVideos] = useState({});

  // Autenticación reactiva
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setSessionChecked(true);
      }
    });

    // Verifica sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setSessionChecked(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Carga videos y escucha cambios
  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.from("videos").select("*");
      if (error) {
        console.error("Error al obtener videos:", error);
      } else {
        setVideos(data);
        const grouped = data.reduce((acc, video) => {
          const category = video.category || "Otros";
          acc[category] = acc[category] || [];
          acc[category].push(video);
          return acc;
        }, {});
        setGroupedVideos(grouped);
      }
    };

    fetchVideos();

    const subscription = supabase
      .channel("videos-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "videos" }, fetchVideos)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (!sessionChecked) return null;

  return (
    <div className="bg-black min-h-screen text-white">
      <TopNavBar />
      {videos.length > 0 ? (
        <>
          <HeroBanner video={videos[0]} />
          {Object.entries(groupedVideos).map(([category, vids]) => (
            <CategoryRow key={category} title={category} videos={vids} />
          ))}
        </>
      ) : (
        <div className="p-4 text-center text-gray-400">No hay contenido para mostrar.</div>
      )}
    </div>
  );
}
