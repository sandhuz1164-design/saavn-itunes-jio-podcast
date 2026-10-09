import { ITunesPodcast } from '../api/itunes';

interface ITunesPodcastCardProps {
  podcast: ITunesPodcast;
  onClick: () => void;
}

export default function ITunesPodcastCard({ podcast, onClick }: ITunesPodcastCardProps) {
  const imageUrl = podcast.artworkUrl600 || podcast.artworkUrl100;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col bg-gray-800/30 hover:bg-gray-700/50 rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 text-left w-full border border-gray-700/50 hover:border-purple-500/30"
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img
          src={imageUrl}
          alt={podcast.collectionName}
          className="w-full aspect-square object-cover group-hover:brightness-110 transition-all"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-purple-600/90 flex items-center justify-center">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-white font-semibold text-xs truncate group-hover:text-purple-300 transition-colors">
        {podcast.collectionName}
      </h3>
      <p className="text-gray-400 text-xs mt-1 truncate">
        {podcast.artistName}
      </p>
      {podcast.primaryGenreName && (
        <span className="inline-block mt-2 text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full truncate">
          {podcast.primaryGenreName}
        </span>
      )}
    </button>
  );
}
