"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Define types based on your data shape
interface Episode {
  id: string;
  name?: string;
  videoUrl: string;
}

interface Season {
  id: string;
  name?: string;
  episodes: Episode[];
}

interface VideoWatchData {
  id: string;
  title: string;
  videoUrl?: string; // For movies or single videos without seasons
  seasons?: Season[]; // For shows with seasons/episodes
}

export default function VideoWatchPage() {
  const params = useParams();
  const videoId = params.id as string;

  const [videoData, setVideoData] = useState<VideoWatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    async function fetchVideoPlayerData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos/${videoId}/watch`);
        if (!res.ok) throw new Error("Network response was not ok");

        const data: VideoWatchData = await res.json();
        setVideoData(data);
      } catch (error) {
        console.error("Failed to load video player data", error);
        setVideoData(null);
      } finally {
        setLoading(false);
      }
    }
    if (videoId) fetchVideoPlayerData();
  }, [videoId]);

  if (loading) return <div>Loading player...</div>;
  if (!videoData) return <div>Video not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{videoData.title}</h1>

      <div className="mb-6">
        <video
          key={`${selectedSeason}-${selectedEpisode}`}
          controls
          src={
            videoData.seasons
              ? videoData.seasons[selectedSeason - 1].episodes[
                  selectedEpisode - 1
                ].videoUrl
              : videoData.videoUrl
          }
          className="w-full max-h-[480px]"
        />
      </div>

      {videoData.seasons && (
        <div>
          <div className="mb-4">
            <label>
              Season:
              <select
                value={selectedSeason}
                onChange={(e) => {
                  setSelectedSeason(Number(e.target.value));
                  setSelectedEpisode(1); // reset episode on season change
                }}
                className="ml-2"
              >
                {videoData.seasons.map((season: Season, idx: number) => (
                  <option key={season.id} value={idx + 1}>
                    {season.name || `Season ${idx + 1}`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Episode:
              <select
                value={selectedEpisode}
                onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                className="ml-2"
              >
                {videoData.seasons[selectedSeason - 1].episodes.map(
                  (ep: Episode, idx: number) => (
                    <option key={ep.id} value={idx + 1}>
                      {ep.name || `Episode ${idx + 1}`}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
