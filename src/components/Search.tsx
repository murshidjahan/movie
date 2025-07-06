"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (!query.trim()) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    debounceTimeout.current = setTimeout(() => {
      searchMovies(query);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  const searchMovies = async (searchTerm: string) => {
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
          searchTerm
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

  // When clicking icon, trigger search immediately
  const handleIconClick = () => {
    if (query.trim()) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      searchMovies(query);
    }
  };

  return (
    <div className="w-full relative max-w-lg mx-auto">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full relative"
        role="search"
        aria-label="Search movies"
      >
        <input
          type="search"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 text-sm rounded-md border border-[color:var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
          aria-describedby="search-help"
          aria-autocomplete="list"
          aria-controls="search-results"
          autoComplete="off"
        />

        {/* Interactive icon on the right */}
        <button
          type="button"
          onClick={handleIconClick}
          className="absolute inset-y-0 right-3 flex items-center justify-center text-[color:var(--foreground)] hover:text-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] rounded"
          aria-label="Search"
          disabled={!query.trim()}
          tabIndex={0}
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </form>

      {/* Loading indicator */}
      {loading && (
        <p
          id="search-help"
          className="mt-2 text-sm text-[color:var(--muted-foreground)]"
        >
          Loading...
        </p>
      )}

      {/* Error message */}
      {error && (
        <p id="search-help" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Results preview */}
      {results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          className="
            absolute
            top-full
            left-0
            mt-1
            w-full
            max-h-60
            overflow-y-auto
            rounded-md
            border
            border-[color:var(--border)]
            bg-card
            p-2
            text-sm
            shadow-lg
            z-50
          "
        >
          {results.map((movie) => (
            <li
              key={movie.id}
              role="option"
              tabIndex={-1}
              className="py-1 border-b last:border-none border-[color:var(--border)] cursor-pointer hover:bg-[color:var(--muted)]"
            >
              {movie.title}{" "}
              {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
