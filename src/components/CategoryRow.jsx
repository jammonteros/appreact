// src/components/CategoryRow.jsx
import { Link } from "react-router-dom";
import t from "../i18n";

export default function CategoryRow({ title, videos }) {
  return (
    <div className="px-4 md:px-8">
      <h2 className="text-2xl font-semibold mb-3 text-white tracking-wide">
        {title}
      </h2>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {videos.map((video) => {
          const card = (
            <div
              key={video.id}
              className="min-w-[180px] max-w-[180px] rounded-lg overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={video.image_url}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                />
                {video.video_url && (
                  <div className="absolute bottom-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                    ▶ {t.see}
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold text-white truncate">
                  {video.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {video.category || "Sin categoría"}
                </p>
              </div>
            </div>
          );

          return video.video_url ? (
            <Link key={video.id} to={`/watch/${video.id}`}>{card}</Link>
          ) : (
            <div key={video.id}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
