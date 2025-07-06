'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Define types here or import from a separate file
interface Actor {
  id: string;
  name: string;
  photo: string;
  character: string;
}

interface VideoInfo {
  id: string;
  title: string;
  banner?: string;
  poster?: string;
  year?: number;
  rating?: number;
  genres?: string[];
  overview?: string;
  cast?: Actor[];
}

export default function VideoInfoPage() {
  const params = useParams();
  const videoId = params.id as string;

  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideoDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos/${videoId}`);
        if (!res.ok) throw new Error("Network response was not ok");

        const data: VideoInfo = await res.json();
        setVideo(data);
      } catch (error) {
        console.error("Failed to load video details", error);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    }

    if (videoId) fetchVideoDetails();
  }, [videoId]);

  if (loading) return <div>Loading info...</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div>
      {/* Banner */}
      {video.banner && (
        <div
          className="h-60 bg-cover bg-center rounded-md"
          style={{ backgroundImage: `url(${video.banner})` }}
          role="img"
          aria-label={`${video.title} banner`}
        />
      )}

      <div className="flex gap-6 mt-4">
        {/* Poster */}
        {video.poster && (
          <img
            src={video.poster}
            alt={`${video.title} poster`}
            className="w-48 rounded-md shadow-lg"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold">{video.title}</h1>
          <p>Year: {video.year ?? "N/A"}</p>
          <p>Rating: {video.rating ?? "N/A"}</p>
          <p>Genres: {video.genres?.join(", ") ?? "N/A"}</p>
          <p className="mt-2 max-w-prose">
            {video.overview ?? "No description available."}
          </p>

          <h2 className="mt-6 font-semibold">Cast:</h2>
          {video.cast?.length ? (
            <ul className="flex gap-4 overflow-x-auto">
              {video.cast.map((actor: Actor) => (
                <li key={actor.id} className="min-w-[100px]">
                  <img
                    src={actor.photo}
                    alt={actor.name}
                    className="rounded-md mb-1"
                  />
                  <p className="text-sm font-semibold">{actor.name}</p>
                  <p className="text-xs text-gray-400">{actor.character}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No cast information available.</p>
          )}
        </div>
      </div>

      {/* Link to watch page */}
      <div className="mt-6">
        <a
          href={`/videos/${videoId}/watch`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Watch Now
        </a>
      </div>
    </div>
  );
}
