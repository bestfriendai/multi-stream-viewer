# Multi-Stream Viewer

A feature-rich, modern web application for watching multiple live streams simultaneously from Twitch, YouTube, and Rumble. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- 📺 Watch up to 16 streams simultaneously from multiple platforms
- 🌐 Support for Twitch, YouTube, and Rumble streams
- 🔗 Add streams using URLs or usernames
- 🎛️ Multiple layout options (1x1, 2x1, 2x2, 3x3, 4x4, Focus mode)
- 📱 Fully responsive design for mobile and desktop
- 🏷️ Platform indicators for each stream

### Advanced Features
- 💬 **Chat Integration** - Tabbed chat interface for all Twitch streams
- 💾 **Saved Layouts** - Save and load your favorite stream combinations
- ⌨️ **Keyboard Shortcuts** - Control streams with keyboard commands
- 🔗 **Shareable Links** - Share your current view with others
- 🌓 **Dark/Light Theme** - Toggle between dark and light modes
- 🔍 **Stream Discovery** - Browse suggested live streams by category
- 🖥️ **Fullscreen Mode** - Watch any stream in fullscreen
- 🔇 **Individual Controls** - Mute/unmute streams independently
- 🎯 **Focus Mode** - Set a primary stream with smaller secondary streams

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd multi-stream-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "Add Stream" button
2. Enter one of the following:
   - **Twitch**: Username (e.g., "shroud") or URL (e.g., "https://www.twitch.tv/shroud")
   - **YouTube**: Live stream URL (e.g., "https://www.youtube.com/watch?v=VIDEO_ID")
   - **Rumble**: Stream URL (e.g., "https://rumble.com/v1234-stream-title.html")
3. Click "Add" to add the stream to your grid
4. Use the layout buttons to switch between different grid layouts
5. Click on any stream to set it as the primary stream in focus mode
6. Hover over streams to access controls:
   - Mute/unmute (Twitch only)
   - Set as primary
   - Remove stream

### Supported URL Formats

**Twitch:**
- `username`
- `https://www.twitch.tv/username`

**YouTube:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://www.youtube.com/live/VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/@channel/live`

**Rumble:**
- `https://rumble.com/vXXXXX-title.html`
- `https://rumble.com/embed/XXXXX`

### Note on Ads

- **Twitch**: Uses the official Twitch embed which may include ads based on the streamer's settings
- **YouTube**: Uses the standard YouTube embed which may show ads
- **Rumble**: Uses the Rumble embed player

Unfortunately, completely removing ads from these platforms' embeds isn't possible through legitimate means, as it would violate their terms of service. The embeds respect each platform's monetization system.

## Keyboard Shortcuts

- **1-9**: Switch to stream N
- **Space/M**: Mute/unmute active stream
- **←→**: Navigate between streams
- **F**: Fullscreen active stream (coming soon)
- **Ctrl/Cmd+X**: Clear all streams
- **?**: Show keyboard shortcuts help

## Advanced Usage

### Shareable Links
Share your current stream setup with others using generated URLs:
```
https://yoursite.com?streams=shroud,pokimane,youtube:VIDEO_ID&layout=2x2
```

### Saved Layouts
- Save your current stream configuration with a custom name
- Load preset layouts or your saved configurations
- Includes gaming and esports presets

### Stream Discovery
- Browse live streams by category
- Quick-add suggested streams
- Filter by Gaming, Esports, Art, Music, and more

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI + Radix UI
- **State Management**: Zustand
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Header.tsx        # Navigation and controls
│   ├── StreamGrid.tsx    # Grid layout for streams
│   └── StreamEmbed.tsx   # Multi-platform stream component
├── store/
│   └── streamStore.ts    # Zustand state management
└── lib/
    ├── utils.ts          # Utility functions
    └── streamParser.ts   # URL parsing for multiple platforms
```

## Development

To contribute or modify:

1. Follow the existing code style
2. Use TypeScript for type safety
3. Test on multiple screen sizes
4. Ensure Twitch embeds work properly

## License

This project is open source and available under the MIT License.