"use client";

import React, { useEffect, useState } from "react";
import MovieGrid from "@/components/MovieGrid";
import LoadingScreen from "@/components/LoadingScreen"; // ✅ import shared loading component

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// ================== Movie Interface ==================
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
  overview: string;
}

export default function TrendingPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ================== Fetch Trending ==================
  useEffect(() => {
    async function loadTrending() {
      setLoading(true);
      try {
        const res = await fetch(`/api/trending?page=${page}`);
        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("❌ Failed to load trending movies:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTrending();
  }, [page]);

  // ================== Pagination Helpers ==================
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

  // ================== Render ==================
  if (loading) return <LoadingScreen />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trending Movies</h1>

      {/* Movie Grid */}
      <MovieGrid
        movies={movies.map((movie) => ({
          title: movie.title,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
          genres: [],
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
                if (page > 1) setPage(page - 1);
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
                if (page < totalPages) setPage(page + 1);
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
