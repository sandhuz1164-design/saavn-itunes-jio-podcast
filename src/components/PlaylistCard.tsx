import { Playlist, getImageUrl } from '../api/saavn';

interface PlaylistCardProps {
  playlist: Playlist;
  index: number;
  onClick: () => void;
}

export default function PlaylistCard({ playlist, index, onClick }: PlaylistCardProps) {
  const imageUrl = getImageUrl(playlist.image, '500x500');

  // Gradient colors for variety
  const gradients = [
    'from-orange-500 via-pink-500 to-purple-600',
    'from-blue-500 via-purple-500 to-pink-500',
    'from-green-500 via-teal-500 to-blue-500',
    'from-red-500 via-orange-500 to-yellow-500',
    'from-purple-500 via-pink-500 to-red-500',
    'from-cyan-500 via-blue-500 to-purple-500',
    'from-yellow-500 via-orange-500 to-red-500',
    'from-pink-500 via-rose-500 to-red-500',
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-emerald-500 via-teal-500 to-cyan-500',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-orange-500/30 text-left w-full"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="relative aspect-square overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={playlist.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <svg className="w-20 h-20 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
            </svg>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Top Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
            <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-xs font-semibold text-white">Top #{index + 1}</span>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-orange-600 shadow-2xl shadow-orange-500/50 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Bottom Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base mb-1 line-clamp-2 drop-shadow-lg">
            {playlist.name}
          </h3>
          {playlist.artists?.primary && playlist.artists.primary.length > 0 && (
            <p className="text-white/80 text-xs font-medium truncate">
              {playlist.artists.primary.map(a => a.name).join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {playlist.songCount && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span className="text-sm font-semibold text-white">{playlist.songCount}</span>
              </div>
            )}
            {playlist.language && (
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                {playlist.language}
              </span>
            )}
          </div>
          <div className="text-orange-400 group-hover:translate-x-1 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}
