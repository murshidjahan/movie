import React, { useEffect, useState } from 'react';
import { fetchWithErrorHandling } from '@/lib/api';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getMovies() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchWithErrorHandling('/api/movies?category=popular&page=1');
        setMovies(data.results || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    }

    getMovies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{color: 'red'}}>Error: {error}</p>;
  if (movies.length === 0) return <p>No movies found.</p>;

  return (
    <ul>
      {movies.map(movie => (
        <li key={movie.id}>{movie.title || movie.name}</li>
      ))}
    </ul>
  );
}
