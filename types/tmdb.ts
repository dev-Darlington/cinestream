export interface TMDBMovie {
id: number;
title: string;
overview: string;
poster_path: string | null;
backdrop_path: string | null;
vote_average: number;
release_date: string;
}

export interface TMDBCast {
id: number;
name: string;
character: string;
profile_path: string | null;
}

export interface TMDBVideo {
id: string;
key: string;
site: "YouTube" | "Vimeo";
type: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
runtime: number;
genres: { id: number; name: string }[];
credits: {
cast: TMDBCast[];
};
videos: {
results: TMDBVideo[];
};
similar: {
results: TMDBMovie[];
};
}