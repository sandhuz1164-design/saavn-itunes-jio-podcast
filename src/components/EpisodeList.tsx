import { PodcastEpisode, getImageUrl, formatDuration } from '../api/saavn';

interface EpisodeListProps {
  episodes: PodcastEpisode[];
  currentEpisode: PodcastEpisode | null;
  onPlay: (episode: PodcastEpisode) => void;
  isLoading?: boolean;
}

export default function EpisodeList({ episodes, currentEpisode, onPlay, isLoading }: EpisodeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-4 p-3 rounded-lg bg-gray-800/30">
            <div className="w-14 h-14 rounded-lg bg-gray-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <p className="text-lg">No episodes found</p>
        <p className="text-sm mt-1">Try searching for a different podcast</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {episodes.map((episode, index) => {
        const imageUrl = getImageUrl(episode.image, '150x150');
        const isCurrentlyPlaying = currentEpisode?.id === episode.id;

        return (
          <button
            key={episode.id || index}
            onClick={() => onPlay(episode)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-left group
              ${isCurrentlyPlaying 
                ? 'bg-purple-600/20 border border-purple-500/30' 
                : 'hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'}`}
          >
            {/* Episode thumbnail */}
            <div className="relative flex-shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={episode.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-600/50 to-pink-600/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  </svg>
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isCurrentlyPlaying ? (
                  <div className="flex gap-0.5">
                    <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" />
                    <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Episode info */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isCurrentlyPlaying ? 'text-purple-300' : 'text-white'}`}>
                {episode.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {episode.duration && (
                  <span className="text-xs text-gray-400">
                    {formatDuration(episode.duration)}
                  </span>
                )}
                {episode.releaseDate && (
                  <span className="text-xs text-gray-500">
                    • {new Date(episode.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {/* Play icon */}
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${isCurrentlyPlaying 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700/50 text-gray-400 group-hover:bg-purple-600 group-hover:text-white'}`}>
                {isCurrentlyPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
