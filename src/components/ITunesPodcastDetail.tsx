import { useState, useEffect } from 'react';
import { ITunesPodcast, PodcastEpisodeITunes, getPodcastEpisodesITunes } from '../api/itunes';

interface ITunesPodcastDetailProps {
  podcast: ITunesPodcast;
  onBack: () => void;
}

export default function ITunesPodcastDetail({ podcast, onBack }: ITunesPodcastDetailProps) {
  const [episodes, setEpisodes] = useState<PodcastEpisodeITunes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 10;

  useEffect(() => {
    loadEpisodes();
  }, [podcast.collectionId]);

  const loadEpisodes = async () => {
    setIsLoading(true);
    const eps = await getPodcastEpisodesITunes(podcast.collectionId);
    setEpisodes(eps);
    setIsLoading(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = episodes.slice(startIndex, endIndex);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDuration = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const imageUrl = podcast.artworkUrl600 || podcast.artworkUrl100;

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
        Back to podcasts
      </button>

      {/* Podcast Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Cover Art */}
        <div className="flex-shrink-0">
          <div className="relative group">
            <img
              src={imageUrl}
              alt={podcast.collectionName}
              className="w-64 h-64 rounded-2xl object-cover shadow-2xl shadow-purple-500/20"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl flex items-center justify-center">
              <a
                href={podcast.collectionViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-16 h-16 rounded-full bg-purple-600/90 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Podcast Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-3">
            {podcast.collectionName}
          </h1>
          
          <p className="text-xl text-gray-300 mb-4">
            by {podcast.artistName}
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            {podcast.primaryGenreName && (
              <span className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium">
                {podcast.primaryGenreName}
              </span>
            )}
            {podcast.releaseDate && (
              <span className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                📅 {formatDate(podcast.releaseDate)}
              </span>
            )}
            <span className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full text-sm">
              🎧 {episodes.length} episodes
            </span>
          </div>

          <div className="flex gap-4">
            <a
              href={podcast.collectionViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Open in Apple Podcasts
            </a>
            {podcast.feedUrl && (
              <a
                href={podcast.feedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11c3.87 0 7 3.13 7 7m-7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                RSS Feed
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="border-t border-gray-800 pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Episodes
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-800/30 rounded-xl p-6">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : episodes.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-lg">No episodes found</p>
          </div>
        ) : (
          <>
            {/* Episodes List */}
            <div className="space-y-4 mb-8">
              {currentEpisodes.map((episode, index) => (
                <div
                  key={episode.trackId}
                  className="bg-gray-800/30 hover:bg-gray-800/50 rounded-xl p-6 transition-colors border border-gray-700/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {episode.trackName}
                      </h3>
                      {episode.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {episode.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>
                          {formatDate(episode.releaseDate)}
                        </span>
                        {episode.trackTimeMillis && (
                          <span>
                            ⏱️ {formatDuration(episode.trackTimeMillis)}
                          </span>
                        )}
                        {episode.trackExplicitness === 'explicit' && (
                          <span className="px-2 py-0.5 bg-red-900/30 text-red-400 rounded text-xs">
                            Explicit
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {episode.previewUrl && (
                        <a
                          href={episode.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Preview
                        </a>
                      )}
                      {episode.trackViewUrl && (
                        <a
                          href={episode.trackViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                            ? 'bg-purple-600 text-white'
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
            <div className="text-center mt-4 text-gray-500 text-sm">
              Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, episodes.length)} of {episodes.length} episodes
            </div>
          </>
        )}
      </div>
    </div>
  );
}
