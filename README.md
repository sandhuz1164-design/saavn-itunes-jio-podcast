# 🎵 PodCaster - Music & Podcast Platform

A modern, feature-rich web application for discovering and streaming podcasts, music, albums, playlists, and live radio stations. Built with React, TypeScript, and Tailwind CSS.

![PodCaster](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-purple)

## ✨ Features

### 🎙️ Podcasts
- **110+ Podcasts** across 12 categories (Technology, Business, Comedy, Science, Health, Education, Sports, Music, News, True Crime, History, Culture)
- Browse one random category at a time with shuffle functionality
- Detailed podcast pages with episode listings and pagination
- Full episode player with progress tracking
- Data sourced from Apple Podcasts via iTunes API

### 🎵 Music
- **Top 10 Songs** with 30-second previews from Apple Music
- **Top 10 Albums** with complete track listings
- **Top 10 Artists** showcase
- Search functionality for songs and albums
- Beautiful card-based UI with hover effects

### 🎶 Playlists
- **Top 10 Playlists** from JioSaavn
- Featured playlist hero banner
- Full playlist detail pages with all songs
- **Play All** functionality with auto-advance queue
- Pagination for large playlists
- Data sourced from JioSaavn API (with iTunes fallback)

### 📻 Radio
- **Live Radio Streaming** from 90,000+ stations worldwide
- Browse by genre (Pop, Rock, Jazz, Classical, Electronic, Hip Hop, Country, R&B, News, Talk, Chill, Workout)
- Search radio stations by name
- Top stations worldwide
- Live player with volume control and station info
- Data from Radio Browser API

### 🎨 UI/UX
- **Apple Music-inspired** left sidebar navigation
- Responsive design (mobile, tablet, desktop)
- Dark theme with gradient accents
- Smooth animations and transitions
- Loading skeletons for better UX
- Professional footer with social links

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/podcaster.git
cd podcaster
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
podcaster/
├── src/
│   ├── api/
│   │   ├── itunes.ts       # iTunes/Apple Music API integration
│   │   ├── radio.ts        # Radio Browser API integration
│   │   └── saavn.ts        # JioSaavn API integration
│   ├── components/
│   │   ├── AlbumCard.tsx
│   │   ├── AlbumDetail.tsx
│   │   ├── ArtistCard.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── EpisodeList.tsx
│   │   ├── Footer.tsx
│   │   ├── ITunesPodcastCard.tsx
│   │   ├── ITunesPodcastDetail.tsx
│   │   ├── PlaylistCard.tsx
│   │   ├── PlaylistDetail.tsx
│   │   ├── PodcastCard.tsx
│   │   ├── Radio.tsx
│   │   ├── RadioPlayer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SongCard.tsx
│   │   └── SongPlayer.tsx
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 4.1
- **Build Tool**: Vite 6.3
- **APIs**:
  - iTunes Search API (free, no auth required)
  - Radio Browser API (free, no auth required)
  - JioSaavn API via saavn.dev (free, with fallback)

## 🎯 Features in Detail

### Navigation
- **Left Sidebar**: Fixed navigation with sections for Home, Radio, Search, and Browse categories
- **Mobile Responsive**: Hamburger menu for mobile devices
- **Active State Indicators**: Visual feedback for current page

### Audio Players
- **Podcast Player**: Full-featured player with progress bar, volume control, skip buttons
- **Song Player**: 30-second preview player for Apple Music tracks
- **Radio Player**: Live streaming player with station info
- **Playlist Queue**: Auto-advance through playlist songs

### Search
- Multi-type search (Podcasts, Songs, Albums, Playlists)
- Real-time search with loading states
- Empty state handling

### Data Sources
- **Apple Music/iTunes**: Songs, albums, artists, podcasts
- **JioSaavn**: Playlists, additional podcasts
- **Radio Browser**: 90,000+ live radio stations

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradients (#a855f7 to #ec4899)
- **Secondary**: Green for songs (#22c55e)
- **Tertiary**: Blue for albums (#3b82f6)
- **Accent**: Orange for playlists (#f97316)
- **Radio**: Red/Orange gradients (#ef4444 to #f97316)

### Typography
- System font stack for optimal performance
- Gradient text effects for headings
- Responsive font sizes

### Components
- Card-based layouts with hover effects
- Skeleton loading states
- Smooth transitions and animations
- Accessible focus states

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔧 Configuration

### Environment Variables
No environment variables required. All APIs are public and don't require authentication.

### API Rate Limits
- **iTunes API**: No strict rate limits, but be respectful
- **Radio Browser**: Free tier, reasonable use
- **JioSaavn**: May have rate limits, fallback implemented

## 🐛 Known Issues

- JioSaavn API may be occasionally unavailable (iTunes fallback in place)
- Some radio stations may not play due to CORS or stream issues
- 30-second previews only for Apple Music (full tracks require subscription)

## 🚀 Future Enhancements

- [ ] User authentication and playlists
- [ ] Favorites/liked songs
- [ ] Download for offline listening
- [ ] Share functionality
- [ ] Dark/Light theme toggle
- [ ] Equalizer settings
- [ ] Sleep timer
- [ ] Crossfade between tracks
- [ ] Lyrics display
- [ ] Social sharing

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Apple Music/iTunes** for music metadata and previews
- **JioSaavn** for podcast and playlist content
- **Radio Browser** for live radio station data
- **Tailwind CSS** for the amazing utility-first CSS framework
- **Vite** for the fast build tool

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ♥ for music lovers worldwide**
