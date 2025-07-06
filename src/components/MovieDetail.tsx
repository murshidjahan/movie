"use client";

import React, { useEffect, useState } from "react";

interface MovieDetails {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  vote_average: number;
  poster_path: string | null;
  certification: string | null;
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
  trailerKey: string | null;
}

interface MovieDetailProps {
  movieId: string;
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieDetail({ movieId }: MovieDetailProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
          setError("API key missing");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos,releases`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch movie details: ${res.statusText}`);
        }

        const data = await res.json();

        let certification = null;
        if (data.releases && data.releases.countries) {
          const usRelease = data.releases.countries.find(
            (c: any) => c.iso_3166_1 === "US"
          );
          certification = usRelease?.certification || null;
        }

        let trailerKey = null;
        if (data.videos && data.videos.results.length > 0) {
          const trailer = data.videos.results.find(
            (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
          );
          trailerKey = trailer ? trailer.key : null;
        }

        const cast = data.credits?.cast ? data.credits.cast.slice(0, 5) : [];

        setMovie({
          id: data.id,
          title: data.title,
          release_date: data.release_date,
          overview: data.overview,
          genres: data.genres,
          runtime: data.runtime,
          production_companies: data.production_companies,
          vote_average: data.vote_average,
          poster_path: data.poster_path,
          certification,
          cast,
          trailerKey,
        });
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!movie) return <p>No movie found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">
        {movie.title}{" "}
        {movie.release_date && `(${movie.release_date.slice(0, 4)})`}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {movie.poster_path && (
          <img
            src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
            alt={`${movie.title} poster`}
            className="w-48 rounded-md shadow-md"
          />
        )}

        <div className="flex-1">
          <p>
            <strong>Rating:</strong> {movie.certification || "N/A"} |{" "}
            <strong>Runtime:</strong> {movie.runtime} min
          </p>

          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres.map((g) => g.name).join(", ") || "N/A"}
          </p>

          <p>
            <strong>Production Companies:</strong>{" "}
            {movie.production_companies.length > 0
              ? movie.production_companies.map((c) => c.name).join(", ")
              : "N/A"}
          </p>

          <p>
            <strong>TMDB Rating:</strong> {movie.vote_average.toFixed(1)} / 10
          </p>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-1">Overview</h2>
            <p>{movie.overview || "No description available."}</p>
          </div>

          {movie.cast.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-1">Top Cast</h2>
              <ul className="flex gap-4 overflow-x-auto">
                {movie.cast.map((actor) => (
                  <li
                    key={actor.id}
                    className="flex flex-col items-center w-20"
                  >
                    {actor.profile_path ? (
                      <img
                        src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                        alt={actor.name}
                        className="rounded-md w-16 h-20 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-300 rounded-md flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}
                    <p className="text-center text-sm mt-1 font-semibold">
                      {actor.name}
                    </p>
                    <p className="text-center text-xs text-gray-600">
                      as {actor.character}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {movie.trailerKey && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Trailer</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${movie.trailerKey}`}
                  title={`${movie.title} Trailer`}
                  allowFullScreen
                  className="w-full h-60 rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
