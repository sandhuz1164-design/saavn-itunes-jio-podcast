import { PodcastSearchResult, getImageUrl } from '../api/saavn';

interface PodcastCardProps {
  podcast: PodcastSearchResult;
  onClick: () => void;
}

export default function PodcastCard({ podcast, onClick }: PodcastCardProps) {
  const imageUrl = getImageUrl(podcast.image, '500x500');

  return (
    <button
      onClick={onClick}
      className="group bg-gray-800/50 hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 text-left w-full border border-gray-700/50 hover:border-purple-500/30"
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={podcast.name}
            className="w-full aspect-square object-cover group-hover:brightness-110 transition-all"
          />
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-purple-600/90 flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-white font-semibold text-sm truncate group-hover:text-purple-300 transition-colors">
        {podcast.name}
      </h3>
      {podcast.description && (
        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
          {podcast.description}
        </p>
      )}
      {podcast.language && (
        <span className="inline-block mt-2 text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">
          {podcast.language}
        </span>
      )}
    </button>
  );
}
