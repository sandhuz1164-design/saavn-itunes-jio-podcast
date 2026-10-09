import { Track, getHighResArtwork, formatTrackDuration } from '../api/itunes';

interface SongCardProps {
  track: Track;
  index: number;
  isPlaying: boolean;
  onClick: () => void;
}

export default function SongCard({ track, index, isPlaying, onClick }: SongCardProps) {
  const artwork = getHighResArtwork(track.artworkUrl100, 600);

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-gray-800/60 w-full text-left border border-transparent hover:border-gray-700/50"
    >
      {/* Rank number */}
      <div className="w-8 text-center flex-shrink-0">
        <span className={`text-lg font-bold ${isPlaying ? 'text-green-400' : 'text-gray-500'}`}>
          {isPlaying ? (
            <div className="flex items-center justify-center gap-0.5">
              <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" />
              <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
              <div className="w-1 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          ) : (
            index + 1
          )}
        </span>
      </div>

      {/* Album art */}
      <div className="relative flex-shrink-0">
        <img
          src={artwork}
          alt={track.trackName}
          className="w-12 h-12 rounded-lg object-cover shadow-md"
        />
        <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            {isPlaying ? (
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
        </div>
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isPlaying ? 'text-green-400' : 'text-white'}`}>
          {track.trackName}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {track.artistName}
        </p>
      </div>

      {/* Album & Duration */}
      <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
        <span className="text-xs text-gray-500 truncate max-w-[150px]">
          {track.collectionName}
        </span>
        <span className="text-xs text-gray-500 w-10 text-right">
          {formatTrackDuration(track.trackTimeMillis)}
        </span>
      </div>

      {/* Spotify link */}
      <a
        href={track.trackViewUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors"
        title="Open in Apple Music"
      >
        <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </a>
    </button>
  );
}
