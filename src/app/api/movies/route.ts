import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "popular";
  const page = url.searchParams.get("page") || "1";

  const tmdbUrl = `https://api.themoviedb.org/3/movie/${category}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;

  try {
    const response = await fetch(tmdbUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch movies from TMDB" },
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
