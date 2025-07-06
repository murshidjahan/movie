"use client";

import React, { useEffect, useState, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";

// ================== INTERFACES ==================
interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
}

// ================== BUTTON STYLES ==================
const buttonClasses = {
  play: "rounded-xl px-8 py-3 font-semibold transition-colors duration-200 font-sans cursor-pointer text-primary-foreground bg-primary hover:bg-secondary",
  info: "rounded-xl px-8 py-3 font-semibold transition-colors duration-200 font-sans cursor-pointer border border-secondary-foreground text-secondary-foreground bg-transparent hover:bg-secondary hover:border-secondary hover:text-primary-foreground",
};

// ================== HERO BANNER ==================
const HeroBanner: React.FC<{ item: MediaItem | null }> = React.memo(
  ({ item }) => {
    if (!item) return null;

    const bgUrl = `https://image.tmdb.org/t/p/original${
      item.backdrop_path || item.poster_path
    }`;

    return (
      <section
        className="relative h-screen w-full flex items-end"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(18,18,18,0.85), transparent 60%), url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "var(--card)",
        }}
        aria-label={`Hero banner for ${item.title || item.name}`}
      >
        <div
          className="max-w-4xl p-12 pb-24"
          style={{
            color: "var(--card-foreground)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <h1 className="text-6xl font-semibold drop-shadow-md">
            {item.title || item.name}
          </h1>
          <p
            className="mt-4 text-lg max-w-xl line-clamp-3 drop-shadow-sm"
            style={{ color: "var(--secondary-foreground)" }}
          >
            {item.overview}
          </p>
          <div className="mt-8 flex space-x-4">
            <button className={buttonClasses.play} type="button">
              ▶ Play
            </button>
            <button className={buttonClasses.info} type="button">
              More Info
            </button>
          </div>
        </div>
      </section>
    );
  }
);

// ================== MEDIA ROW ==================
const MediaRow: React.FC<{ title: string; items: MediaItem[] }> = React.memo(
  ({ title, items }) => {
    return (
      <section className="w-full px-6 mb-12">
        <h2
          className="text-3xl font-semibold mb-4"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)" }}
        >
          {title}
        </h2>
        <div className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-52 snap-center cursor-pointer transform transition-transform hover:scale-105"
              title={item.title || item.name}
            >
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w400${item.poster_path}`}
                  alt={item.title || item.name}
                  className="rounded-xl shadow-lg object-cover w-full h-72"
                  loading="lazy"
                  decoding="async"
                  style={{ backgroundColor: "var(--card)" }}
                />
              ) : (
                <div
                  className="rounded-xl w-full h-72 flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: "var(--muted)",
                    color: "var(--muted-foreground)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  No Image
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }
);

// ================== MAIN HOMEPAGE COMPONENT ==================
export default function HomePage() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tvShows, setTvShows] = useState<MediaItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from APIs
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [moviesRes, tvRes, trendingRes] = await Promise.all([
        fetch("/api/movies?category=popular&page=1"),
        fetch("/api/tv?category=popular&page=1"),
        fetch("/api/trending"),
      ]);

      const [moviesData, tvData, trendingData] = await Promise.all([
        moviesRes.json(),
        tvRes.json(),
        trendingRes.json(),
      ]);

      setMovies(moviesData.results ?? []);
      setTvShows(tvData.results ?? []);
      setTrending(trendingData.results ?? []);
    } catch (error) {
      console.error("❌ Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingScreen />;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <HeroBanner item={movies[0] ?? null} />
      <main className="pt-6">
        <MediaRow title="Popular Movies" items={movies.slice(1, 16)} />
        <MediaRow title="Popular TV Shows" items={tvShows.slice(0, 15)} />
        <MediaRow title="Trending Now" items={trending.slice(0, 15)} />
      </main>
    </div>
  );
}
