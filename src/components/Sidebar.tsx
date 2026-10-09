import { View } from '../App';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentView, onNavigate, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: 'home' as View, label: 'Home', icon: HomeIcon },
    { id: 'radio' as View, label: 'Radio', icon: RadioIcon },
    { id: 'search' as View, label: 'Search', icon: SearchIcon },
  ];

  const browseItems = [
    { id: 'podcasts' as View, label: 'Podcasts', icon: PodcastIcon, color: 'text-purple-400' },
    { id: 'songs' as View, label: 'Songs', icon: MusicIcon, color: 'text-green-400' },
    { id: 'albums' as View, label: 'Albums', icon: AlbumIcon, color: 'text-blue-400' },
    { id: 'playlists' as View, label: 'Playlists', icon: PlaylistIcon, color: 'text-orange-400' },
  ];

  const handleNavigate = (view: View) => {
    onNavigate(view);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PodCaster
                </h1>
                <p className="text-xs text-gray-500">Music & Podcasts</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {/* Main Nav */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Menu
              </h3>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Browse Section */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Browse
              </h3>
              <ul className="space-y-1">
                {browseItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavigate(item.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
                      >
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800/50">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-xs text-gray-400 mb-2">
                🎵 Discover podcasts, songs, albums & playlists
              </p>
              <p className="text-xs text-gray-500">
                Powered by JioSaavn & Apple Music
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Icon Components
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function RadioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function PodcastIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
    </svg>
  );
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  );
}

function AlbumIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
    </svg>
  );
}

function PlaylistIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
    </svg>
  );
}
