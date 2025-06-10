import { useRef, useEffect } from "react";
import Hls from "hls.js";

export default function HLSPlayer({ url }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;

    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.error("Reproducción fallida:", err));
      });

      return () => {
        if (hls) hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      console.error("Este navegador no soporta HLS");
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      className="w-full aspect-video bg-black"
      poster="https://placehold.co/1280x720?text=Reproduciendo+en+vivo"
    />
  );
}