import type { NextApiRequest, NextApiResponse } from "next";
import { TMDBMovie } from "../../types/tmdb";

interface TMDBListResponse<T> {
  results: T[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TMDBListResponse<TMDBMovie>>
) {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ results: [] });
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  res.status(200).json({ results: data.results || [] });
}
