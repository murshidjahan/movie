"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MovieCardProps {
  title: string;
  posterUrl?: string;
  genres?: string[];
  overview?: string;
  onWatchClick?: () => void;
}

export default function MovieCard({
  title,
  posterUrl = "",
  genres = [],
  overview = "",
  onWatchClick,
}: MovieCardProps) {
  return (
    <Card className="w-[250px] h-[450px] rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="p-0 overflow-hidden rounded-t-lg">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${title} Poster`}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
            No Image Available
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-grow flex flex-col">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground mb-2">
          {genres.length ? genres.join(", ") : "Genre info not available"}
        </p>
        <p className="text-sm line-clamp-3 flex-grow overflow-hidden">
          {overview || "No overview available."}
        </p>
      </CardContent>

      <CardFooter>
        <Button variant="default" className="w-full" onClick={onWatchClick}>
          Watch Now
        </Button>
      </CardFooter>
    </Card>
  );
}
