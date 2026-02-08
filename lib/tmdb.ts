import { TMDBMovie, TMDBMovieDetails } from "../types/tmdb";
import { Genre } from "@/types/genre";

const API_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;


// interface TMDBListResponse<T> {
// results: T[];
// }

// export async function fetchTrending(): Promise<TMDBMovie[]> {
// const res = await fetch(`${API_BASE}/trending/movie/week`, { headers });
// const data: TMDBListResponse<TMDBMovie> = await res.json();
// return data.results;
// }

export async function fetchTrending(): Promise<TMDBMovie[]> {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);

    if (!res.ok) {
      throw new Error("Failed to fetch trending movies");
    }

    const data = await res.json();

    return Array.isArray(data.results) ? data.results : [];
  } catch (error) {
    console.error("fetchTrending error:", error);
    return [];
  }
}


export async function fetchMovieDetails(
  id: string
): Promise<TMDBMovieDetails | null> {
  try {
    const res = await fetch(
      `${API_BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar`
    );

    if (!res.ok) throw new Error("Failed to fetch movie details");

    return await res.json();
  } catch (err) {
    console.error("fetchMovieDetails error:", err);
    return null;
  }
}

export async function searchMovies(
  query: string
): Promise<TMDBMovie[]> {
  try {
    const res = await fetch(
      `${API_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!res.ok) throw new Error("Search failed");

    const data = await res.json();
    return Array.isArray(data.results) ? data.results : [];
  } catch (err) {
    console.error("searchMovies error:", err);
    return [];
  }
}

// export async function addToFavorites(id: string): Promise<TMDBMovie[]>{
//     const res = await fetch(
//         `${API_BASE}/movie/${id}?`
//     )
//     return res.json();
// }

/*****************Fetch Movies By Genre */

export async function fetchGenres(): Promise<Genre[]> {
  try {
    const res = await fetch(
      `${API_BASE}/genre/movie/list?api_key=${API_KEY}`
    );

    if (!res.ok) throw new Error("Failed to fetch genres");

    const data = await res.json();
    return Array.isArray(data.genres) ? data.genres : [];
  } catch (err) {
    console.error("fetchGenres error:", err);
    return [];
  }
}
  
  export async function fetchMoviesByGenre(
    genreId: number
  ): Promise<TMDBMovie[]> {
    const res = await fetch(
      `${API_BASE}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );
  
    if (!res.ok) {
      throw new Error("Failed to fetch genre movies");
    }
  
    const data = await res.json();
    return data.results;
  }