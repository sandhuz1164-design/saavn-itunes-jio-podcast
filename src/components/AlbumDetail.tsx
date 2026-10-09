import { useState, useEffect } from 'react';
import { Album, Track, getHighResArtwork, getAlbumTracks, formatTrackDuration } from '../api/itunes';

interface AlbumDetailProps {
  album: Album;
  onBack: () => void;
  onPlayTrack: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export default function AlbumDetail({ album, onBack, onPlayTrack, currentTrack, isPlaying }: AlbumDetailProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, [album.collectionId]);

  const loadTracks = async () => {
    setIsLoading(true);
    const albumTracks = await getAlbumTracks(album.collectionId);
    setTracks(albumTracks);
    setIsLoading(false);
  };

  const artwork = getHighResArtwork(album.artworkUrl100, 600);
  const releaseYear = new Date(album.releaseDate).getFullYear();

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to albums
      </button>

      {/* Album header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="w-48 h-48 flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={artwork}
            alt={album.collectionName}
            className="w-full h-full rounded-2xl object-cover shadow-2xl shadow-blue-500/20"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <span className="text-xs text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase tracking-wider font-medium">
            Album
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-3">
            {album.collectionName}
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            {album.artistName}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4 justify-center sm:justify-start">
            <span className="text-sm text-gray-400">
              📅 {releaseYear}
            </span>
            <span className="text-sm text-gray-400">
              🎵 {album.trackCount} tracks
            </span>
            {album.primaryGenreName && (
              <span className="text-sm text-gray-400">
                🎼 {album.primaryGenreName}
              </span>
            )}
          </div>
          <div className="mt-4 flex gap-3 justify-center sm:justify-start">
            <a
              href={album.collectionViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-medium text-white transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              View on Apple Music
            </a>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Tracks ({tracks.length})
        </h2>

        {isLoading ? (
          <div className="bg-gray-800/30 rounded-2xl p-4 space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-3">
                <div className="w-8 h-4 bg-gray-700 rounded" />
                <div className="w-12 h-12 rounded-lg bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/2" />
                  <div className="h-3 bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : tracks.length > 0 ? (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 overflow-hidden">
            <div className="divide-y divide-gray-800/50">
              {tracks.map((track, index) => {
                const trackArtwork = getHighResArtwork(track.artworkUrl100, 600);
                const isCurrentTrack = currentTrack?.trackId === track.trackId;

                return (
                  <button
                    key={track.trackId}
                    onClick={() => onPlayTrack(track)}
                    className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-gray-800/60 w-full text-left border border-transparent hover:border-gray-700/50 ${
                      isCurrentTrack && isPlaying ? 'bg-blue-600/20 border-blue-500/30' : ''
                    }`}
                  >
                    {/* Track number */}
                    <div className="w-8 text-center flex-shrink-0">
                      <span className={`text-lg font-bold ${isCurrentTrack && isPlaying ? 'text-blue-400' : 'text-gray-500'}`}>
                        {isCurrentTrack && isPlaying ? (
                          <div className="flex items-center justify-center gap-0.5">
                            <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" />
                            <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                            <div className="w-1 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                          </div>
                        ) : (
                          index + 1
                        )}
                      </span>
                    </div>

                    {/* Track artwork */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={trackArtwork}
                        alt={track.trackName}
                        className="w-12 h-12 rounded-lg object-cover shadow-md"
                      />
                      <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          {isCurrentTrack && isPlaying ? (
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          ) : (
                            <path d="M8 5v14l11-7z" />
                          )}
                        </svg>
                      </div>
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrentTrack && isPlaying ? 'text-blue-400' : 'text-white'}`}>
                        {track.trackName}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {track.artistName}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="flex-shrink-0">
                      <span className="text-xs text-gray-500">
                        {formatTrackDuration(track.trackTimeMillis)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-lg">No tracks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
