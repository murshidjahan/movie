"use client";

import React, { useEffect, useState } from "react";

interface Genre {
  id: number;
  name: string;
}
interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

interface Movie {
  id: number;
  title: string;
  release_date: string;
  runtime: number;
  overview: string;
  poster_path: string | null;
  genres: Genre[];
  production_companies: ProductionCompany[];
  vote_average: number;
  certification?: string;
}

interface Props {
  params: { id: string };
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MoviePage({ params }: Props) {
  const { id } = params;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      setLoading(true);
      setError("");
      setMovie(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
          setError("API key is missing");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=releases`
        );

        if (!res.ok) {
          throw new Error(`TMDB API error: ${res.statusText}`);
        }

        const data = await res.json();

        // Extract US certification if available
        let certification = "";
        if (data.releases && data.releases.countries) {
          const usRelease = data.releases.countries.find(
            (c: any) => c.iso_3166_1 === "US"
          );
          certification = usRelease?.certification || "";
        }

        setMovie({ ...data, certification });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <p className="p-4">Loading movie details...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!movie) return <p className="p-4">No movie data.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold">
        {movie.title}{" "}
        {movie.release_date && `(${movie.release_date.slice(0, 4)})`}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster */}
        {movie.poster_path && (
          <img
            src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
            alt={`${movie.title} poster`}
            className="w-48 rounded-md shadow-md"
          />
        )}

        <div className="flex-1 space-y-3">
          <p>
            <strong>Rating:</strong> {movie.certification || "N/A"} |{" "}
            <strong>Runtime:</strong> {movie.runtime} min
          </p>

          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres.length > 0
              ? movie.genres.map((g) => g.name).join(", ")
              : "N/A"}
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

          <div>
            <h2 className="text-2xl font-semibold mb-1">Overview</h2>
            <p>{movie.overview || "No description available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
