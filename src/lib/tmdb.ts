export async function fetchTrendingMovies(page = 1) {
  const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?page=${page}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      accept: 'application/json',
    },
    next: { revalidate: 60 }, // optional: caching for 60 seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trending movies");
  }

  return res.json();
}
