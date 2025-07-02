# News Aggregator App

A modern news aggregator built with React, TypeScript, TanStack Query, and Tailwind CSS. Features articles from multiple news sources including NewsAPI, The Guardian, and The New York Times.

## Features

- 📰 Real-time news fetching from multiple sources (NewsAPI, The Guardian & The New York Times)
- 🔍 Advanced search with filtering by source, category, and date
- 🎨 Newspaper-style grid layout with featured articles
- 📱 Responsive design optimized for all devices
- ⚡ Fast data fetching with TanStack Query
- 🔄 Automatic refresh and caching
- 💫 Smooth loading states and error handling
- 🌐 Multi-source aggregation with duplicate detection

## App Demo

🎥 **[Watch the App Demo Video](https://www.awesomescreenshot.com/video/41588942?key=5dc8cb6cf2a6db00b5dc9c2965fb5146)**

See the News Aggregator App in action! The demo showcases all the key features including real-time news fetching, advanced search functionality, and the responsive newspaper-style layout.

## News Sources

- **NewsAPI** - Comprehensive news from various publishers
- **The Guardian** - Quality journalism from The Guardian newspaper
- **The New York Times** - Premium news content from The New York Times

## Installation

### Option 1: Local Development

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env` file in the root directory with the following:

```bash
VITE_NEWSAPI_KEY= *your_newsapi_key_here*
VITE_GAURDIAN_KEY= *your_guardian_api_key_here*
VITE_NYTIMES_KEY= *your_nytimes_api_key_here*
```

3. Start the development server:

```bash
npm run dev
```

### Option 2: Docker

1. Clone the repository

2. Build the Docker image with your API keys:

```bash
docker build \
--build-arg VITE_NEWSAPI_KEY=your_newsapi_key_here \
--build-arg VITE_GAURDIAN_KEY=your_guardian_api_key_here \
--build-arg VITE_NYTIMES_KEY=your_nytimes_api_key_here \
-t news-aggregator-app .
```

3. Run the Docker container:

```bash
docker run -p 5173:80 news-aggregator-app
```

The app will be available at `http://localhost:5173`

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
4. Add it to your `.env` file as `VITE_GAURDIAN_KEY`

### New York Times API

1. Visit [NY Times Developer Portal](https://developer.nytimes.com/apis)
2. Sign up for a developer account
3. Create an app and get your API key for the Article Search API
4. Add it to your `.env` file as `VITE_NYTIMES_KEY`

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Hook From** - Form Handling
