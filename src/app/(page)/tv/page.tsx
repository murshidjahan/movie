"use client";

import React, { useEffect, useState } from "react";
import MovieGrid from "@/components/MovieGrid";
import LoadingScreen from "@/components/LoadingScreen";
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

// ================== Interfaces ==================
interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  genre_ids: number[];
  overview: string;
}

interface Genre {
  id: number;
  name: string;
}

const TV_CATEGORIES = [
  { label: "Popular", value: "popular" },
  { label: "Airing Today", value: "airing_today" },
  { label: "On The Air", value: "on_the_air" },
  { label: "Top Rated", value: "top_rated" },
];

export default function TVShowsPage() {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [category, setCategory] = useState("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ================== Fetch Genres ==================
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch("/api/tv/genres");
        const data = await res.json();
        const genreMap: Record<number, string> = {};
        data.genres?.forEach((g: Genre) => {
          genreMap[g.id] = g.name;
        });
        setGenres(genreMap);
      } catch (error) {
        console.error("❌ Failed to load TV genres:", error);
      }
    }
    fetchGenres();
  }, []);

  // ================== Fetch TV Shows ==================
  useEffect(() => {
    async function fetchShows() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tv?category=${category}&page=${page}`);
        const data = await res.json();
        setShows(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("❌ Failed to load TV shows:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchShows();
  }, [category, page]);

  // ================== Helpers ==================
  const mapGenres = (ids: number[]) =>
    ids.map((id) => genres[id]).filter(Boolean);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // ================== Render ==================
  if (loading) return <LoadingScreen />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">TV Shows</h1>

      {/* Tabs for categories */}
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
          {TV_CATEGORIES.map(({ label, value }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Movie Grid */}
      <MovieGrid
        movies={shows.map((show) => ({
          title: show.name,
          posterUrl: show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : "",
          genres: mapGenres(show.genre_ids),
          overview: show.overview,
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

          {getPageNumbers().map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(p);
                }}
              >
                {p}
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
