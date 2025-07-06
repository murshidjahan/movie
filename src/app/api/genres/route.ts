import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch genres" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB fetch genres error:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching genres." },
      { status: 500 }
    );
  }
}
