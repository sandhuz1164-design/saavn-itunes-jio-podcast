import { Artist } from '../api/itunes';

interface ArtistCardProps {
  artist: Artist;
  rank: number;
}

export default function ArtistCard({ artist, rank }: ArtistCardProps) {
  const imageUrl = artist.artworkUrl100 || '';

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer group">
      {/* Rank */}
      <div className="flex-shrink-0 w-6 text-center">
        <span className="text-sm font-bold text-gray-500">{rank}</span>
      </div>

      {/* Artist Image */}
      <div className="relative flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={artist.artistName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-green-500/50 transition-all"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Artist Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition-colors">
          {artist.artistName}
        </p>
        {artist.primaryGenreName && (
          <p className="text-xs text-gray-500 truncate">
            {artist.primaryGenreName}
          </p>
        )}
      </div>

      {/* External Link */}
      <a
        href={artist.artistLinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
