import { TMDBMovie, TMDBMovieDetails } from "../types/tmdb";

const API_BASE = "https://api.themoviedb.org/3";

const headers = {
Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
"Content-Type": "application/json",
};

interface TMDBListResponse<T> {
results: T[];
}

export async function fetchTrending(): Promise<TMDBMovie[]> {
const res = await fetch(`${API_BASE}/trending/movie/week`, { headers });
const data: TMDBListResponse<TMDBMovie> = await res.json();
return data.results;
}

export async function fetchMovieDetails(
id: string
): Promise<TMDBMovieDetails> {
const res = await fetch(
`${API_BASE}/movie/${id}?append_to_response=credits,videos,similar`,
{ headers }
);
return res.json();
}

export async function searchMovies(
query: string
): Promise<TMDBMovie[]> {
const res = await fetch(
`${API_BASE}/search/movie?query=${encodeURIComponent(query)}`,
{ headers }
);
const data: TMDBListResponse<TMDBMovie> = await res.json();
return data.results;
}

export async function addToFavorites(id: string): Promise<TMDBMovie[]>{
    const res = await fetch(
        `${API_BASE}/movie/${id}?`
    )
    return res.json();
}