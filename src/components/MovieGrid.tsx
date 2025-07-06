"use client";

import React from "react";
import MovieCard from "@/components/MovieCard";

interface Movie {
  title: string;
  posterUrl?: string;
  genres?: string[];
  overview?: string;
  onWatchClick?: () => void;
}

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="p-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie, index) => (
          <MovieCard
            key={index}
            title={movie.title}
            posterUrl={movie.posterUrl}
            genres={movie.genres}
            overview={movie.overview}
            onWatchClick={movie.onWatchClick}
          />
        ))}
      </div>
    </div>
  );
}
