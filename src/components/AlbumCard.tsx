import { Album, getHighResArtwork } from '../api/itunes';

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

export default function AlbumCard({ album, onClick }: AlbumCardProps) {
  const artwork = getHighResArtwork(album.artworkUrl100, 600);

  return (
    <button
      onClick={onClick}
      className="group flex flex-col bg-gray-800/30 hover:bg-gray-700/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 text-left w-full border border-gray-700/50 hover:border-blue-500/30"
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img
          src={artwork}
          alt={album.collectionName}
          className="w-full aspect-square object-cover group-hover:brightness-110 transition-all"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-blue-600/90 flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-white font-semibold text-sm truncate group-hover:text-blue-300 transition-colors">
        {album.collectionName}
      </h3>
      <p className="text-gray-400 text-xs mt-1 truncate">
        {album.artistName}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
          {album.trackCount} tracks
        </span>
        {album.releaseDate && (
          <span className="text-xs text-gray-500">
            {new Date(album.releaseDate).getFullYear()}
          </span>
        )}
      </div>
    </button>
  );
}
