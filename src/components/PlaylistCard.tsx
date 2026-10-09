import { Playlist, getImageUrl } from '../api/saavn';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
}

export default function PlaylistCard({ playlist, onClick }: PlaylistCardProps) {
  const imageUrl = getImageUrl(playlist.image, '500x500');

  return (
    <button
      onClick={onClick}
      className="group flex flex-col bg-gray-800/30 hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 text-left w-full border border-gray-700/50 hover:border-orange-500/30"
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={playlist.name}
            className="w-full aspect-square object-cover group-hover:brightness-110 transition-all"
          />
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-orange-600/90 flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-white font-semibold text-sm truncate group-hover:text-orange-300 transition-colors">
        {playlist.name}
      </h3>
      {playlist.description && (
        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
          {playlist.description}
        </p>
      )}
      <div className="flex items-center gap-2 mt-2">
        {playlist.songCount && (
          <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
            {playlist.songCount} songs
          </span>
        )}
        {playlist.language && (
          <span className="text-xs text-gray-500">
            {playlist.language}
          </span>
        )}
      </div>
    </button>
  );
}
