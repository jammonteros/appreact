// src/components/VideoPlayerPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import ReactPlayer from "react-player";
import Hls from "hls.js";
import dashjs from "dashjs";

export default function VideoPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      const { data, error } = await supabase.from("videos").select("*").eq("id", id).single();
      if (error) {
        console.error("Error al cargar video:", error);
      } else {
        setVideo(data);
        setIsReady(true);
      }
    };
    fetchVideo();
  }, [id]);

  if (!isReady || !video) {
    return (
      <div className="text-white text-center mt-20">
        <p>Cargando video...</p>
      </div>
    );
  }

  const isHLS = video.video_url.endsWith(".m3u8");
  const isDASH = video.video_url.endsWith(".mpd");
  const isHTML5 = video.video_url.endsWith(".mp4") || video.video_url.endsWith(".mov") || video.video_url.endsWith(".webm");

  return (
    <div className="bg-black min-h-screen text-white p-4">
      <button
        onClick={() => navigate("/")}
        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded mb-4"
      >
        ← Volver
      </button>

      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        {video.image_url && (
          <img
            src={video.image_url}
            alt={video.title}
            className="w-full h-64 object-cover rounded"
          />
        )}

        <VideoRenderer url={video.video_url} />

        <p className="text-gray-400">
          <strong>Categoría:</strong> {video.category || "Sin categoría"}
        </p>
      </div>
    </div>
  );
}

function VideoRenderer({ url }) {
  const videoRef = useState(() => document.createElement("video"))[0];
  const containerRef = useState(() => document.createElement("div"))[0];

  useEffect(() => {
    if (!url || !videoRef) return;

    if (url.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef);
      } else if (videoRef.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.src = url;
      }
    } else if (url.endsWith(".mpd")) {
      const dash = dashjs.MediaPlayer().create();
      dash.initialize(videoRef, url, true);
    } else {
      videoRef.src = url;
    }

    videoRef.controls = true;
    videoRef.className = "w-full h-full rounded";

    containerRef.innerHTML = "";
    containerRef.appendChild(videoRef);
  }, [url]);

  return <div ref={(el) => el && el.appendChild(containerRef)} className="aspect-video" />;
}
