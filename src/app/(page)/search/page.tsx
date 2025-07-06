"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      setResults([]);

      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
          setError("API key is missing");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}&api_key=${apiKey}`
        );

        if (!res.ok) {
          throw new Error(`TMDB API error: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.results) {
          setResults(data.results);
        } else {
          setError("No results found");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">
        Search results for &quot;{query}&quot;
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && results.length === 0 && <p>No results found.</p>}

      <ul className="space-y-2">
        {results.map((movie) => (
          <li
            key={movie.id}
            className="border border-[color:var(--border)] rounded p-3 hover:bg-[color:var(--muted)] cursor-pointer"
          >
            <Link href={`/movie/${movie.id}`} className="block">
              <strong>{movie.title}</strong>{" "}
              {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ""}
              <p className="text-sm mt-1 text-[color:var(--muted-foreground)]">
                {movie.overview}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
