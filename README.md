# News Aggregator App

A modern news aggregator built with React, TypeScript, TanStack Query, and Tailwind CSS. Features articles from multiple news sources including NewsAPI and The Guardian.

## Features

- 📰 Real-time news fetching from multiple sources (NewsAPI & The Guardian)
- 🔍 Advanced search with filtering by source, category, and date
- 🎨 Newspaper-style grid layout with featured articles
- 📱 Responsive design optimized for all devices
- ⚡ Fast data fetching with TanStack Query
- 🔄 Automatic refresh and caching
- 💫 Smooth loading states and error handling
- 🌐 Multi-source aggregation with duplicate detection

## News Sources

- **NewsAPI** - Comprehensive news from various publishers
- **The Guardian** - Quality journalism from The Guardian newspaper

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env` file in the root directory with the following:

```bash
VITE_NEWSAPI_KEY=your_newsapi_key_here
VITE_GUARDIAN_API_KEY=your_guardian_api_key_here
```

3. Start the development server:

```bash
npm run dev
```

## API Keys Setup

### NewsAPI

1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key
4. Add it to your `.env` file as `VITE_NEWSAPI_KEY`

### Guardian API

1. Visit [Guardian Open Platform](https://open-platform.theguardian.com/access/)
2. Register for a developer key
3. Copy your API key
4. Add it to your `.env` file as `VITE_GUARDIAN_API_KEY`

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
