import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET() {
  const tmdbUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`;

  try {
    const response = await fetch(tmdbUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch trending data from TMDB" },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
console.log("TMDB_API_KEY:", process.env.TMDB_API_KEY);
