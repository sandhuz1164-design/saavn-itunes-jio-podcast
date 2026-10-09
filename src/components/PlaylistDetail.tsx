import { useState, useEffect } from 'react';
import { Playlist, PlaylistSong, getPlaylistDetails, getImageUrl, getDownloadUrl, formatDuration } from '../api/saavn';

interface PlaylistDetailProps {
  playlist: Playlist;
  onBack: () => void;
  onPlaySong: (song: PlaylistSong) => void;
  currentSong: PlaylistSong | null;
  isPlaying: boolean;
}

export default function PlaylistDetail({ playlist, onBack, onPlaySong, currentSong, isPlaying }: PlaylistDetailProps) {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;

  useEffect(() => {
    loadSongs();
  }, [playlist.id]);

  const loadSongs = async () => {
    setIsLoading(true);
    const data = await getPlaylistDetails(playlist.id);
    if (data) {
      setSongs(data.songs);
    }
    setIsLoading(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(songs.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const endIndex = startIndex + songsPerPage;
  const currentSongs = songs.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const imageUrl = getImageUrl(playlist.image, '500x500');

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to playlists
      </button>

      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Cover Art */}
        <div className="flex-shrink-0">
          <div className="relative group">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={playlist.name}
                className="w-64 h-64 rounded-2xl object-cover shadow-2xl shadow-orange-500/20"
              />
            ) : (
              <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/20">
                <svg className="w-24 h-24 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-orange-600/90 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-3">
            {playlist.name}
          </h1>
          
          {playlist.description && (
            <p className="text-gray-300 text-lg mb-4 line-clamp-3">
              {playlist.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            {playlist.songCount && (
              <span className="px-4 py-2 bg-orange-600/20 text-orange-300 rounded-full text-sm font-medium">
                🎵 {playlist.songCount} songs
              </span>
            )}
            {playlist.language && (
              <span className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                🌐 {playlist.language}
              </span>
            )}
            {playlist.artists?.primary && playlist.artists.primary.length > 0 && (
              <span className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                🎤 {playlist.artists.primary.map(a => a.name).join(', ')}
              </span>
            )}
          </div>

          <a
            href={playlist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open on JioSaavn
          </a>
        </div>
      </div>

      {/* Songs Section */}
      <div className="border-t border-gray-800 pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Songs
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-gray-400 text-lg">No songs found in this playlist</p>
          </div>
        ) : (
          <>
            {/* Songs List */}
            <div className="space-y-3 mb-8">
              {currentSongs.map((song, index) => {
                const songImageUrl = getImageUrl(song.image, '150x150');
                const isCurrentSong = currentSong?.id === song.id;

                return (
                  <button
                    key={song.id || `${startIndex + index}`}
                    onClick={() => onPlaySong(song)}
                    className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-gray-800/60 w-full text-left border ${
                      isCurrentSong && isPlaying
                        ? 'bg-orange-600/20 border-orange-500/30'
                        : 'border-transparent hover:border-gray-700/50'
                    }`}
                  >
                    {/* Song number */}
                    <div className="w-8 text-center flex-shrink-0">
                      <span className={`text-lg font-bold ${isCurrentSong && isPlaying ? 'text-orange-400' : 'text-gray-500'}`}>
                        {isCurrentSong && isPlaying ? (
                          <div className="flex items-center justify-center gap-0.5">
                            <div className="w-1 h-3 bg-orange-400 rounded-full animate-pulse" />
                            <div className="w-1 h-4 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                            <div className="w-1 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                          </div>
                        ) : (
                          startIndex + index + 1
                        )}
                      </span>
                    </div>

                    {/* Song artwork */}
                    <div className="relative flex-shrink-0">
                      {songImageUrl ? (
                        <img
                          src={songImageUrl}
                          alt={song.name}
                          className="w-14 h-14 rounded-lg object-cover shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-600/50 to-red-600/50 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          {isCurrentSong && isPlaying ? (
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          ) : (
                            <path d="M8 5v14l11-7z" />
                          )}
                        </svg>
                      </div>
                    </div>

                    {/* Song info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrentSong && isPlaying ? 'text-orange-400' : 'text-white'}`}>
                        {song.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {song.artists?.primary?.map(a => a.name).join(', ') || 'Unknown Artist'}
                        {song.album?.name && ` • ${song.album.name}`}
                      </p>
                    </div>

                    {/* Duration */}
                    {song.duration && (
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-500">
                          {formatDuration(song.duration)}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="text-center mt-4 text-gray-500 text-sm">
                Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, songs.length)} of {songs.length} songs
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
