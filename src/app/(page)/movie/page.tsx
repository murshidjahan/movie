"use client";

import React, { useEffect, useState } from "react";
import MovieGrid from "@/components/MovieGrid";
import LoadingScreen from "@/components/LoadingScreen"; // ✅ Reusable loading UI

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// ================== Types ==================
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
  overview: string;
}

interface Genre {
  id: number;
  name: string;
}

const MOVIE_CATEGORIES = [
  { label: "Popular", value: "popular" },
  { label: "Now Playing", value: "now_playing" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Top Rated", value: "top_rated" },
];

// ================== Component ==================
export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [category, setCategory] = useState("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ================== Load genres once ==================
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch("/api/genres");
        const data = await res.json();
        if (!data.genres) throw new Error("No genres returned");
        const genreMap: Record<number, string> = {};
        data.genres.forEach((g: Genre) => {
          genreMap[g.id] = g.name;
        });
        setGenres(genreMap);
      } catch (error) {
        console.error("❌ Failed to load genres:", error);
      }
    }

    fetchGenres();
  }, []);

  // ================== Load movies by category/page ==================
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/movies?category=${category}&page=${page}`
        );
        const data = await res.json();
        if (!data.results) throw new Error("No results");
        setMovies(data.results);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("❌ Failed to load movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [category, page]);

  // ================== Helpers ==================
  const mapGenres = (ids: number[]) =>
    ids.map((id) => genres[id]).filter(Boolean);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // ================== Loading ==================
  if (loading) return <LoadingScreen />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>

      {/* Category Tabs */}
      <Tabs
        defaultValue={category}
        value={category}
        onValueChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
        className="mb-6"
      >
        <TabsList>
          {MOVIE_CATEGORIES.map(({ label, value }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Movie Grid */}
      <MovieGrid
        movies={movies.map((movie) => ({
          title: movie.title,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
          genres: mapGenres(movie.genre_ids),
          overview: movie.overview,
        }))}
      />

      {/* Pagination */}
      <Pagination className="mt-6 flex justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1 && !loading) setPage(page - 1);
              }}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {page > 3 && totalPages > 5 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {page > 4 && totalPages > 6 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {getPageNumbers().map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === page}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(pageNumber);
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}

          {page < totalPages - 3 && totalPages > 6 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {page < totalPages - 2 && totalPages > 5 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages && !loading) setPage(page + 1);
              }}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
