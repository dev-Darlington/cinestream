import { useState } from "react";
import { TMDBMovie } from "../../types/tmdb";


export default function SearchBar() {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<TMDBMovie[]>([]);


    async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);


        if (value.length < 2) return;


        const res = await fetch(`/api/search?q=${value}`);
        const data = await res.json();


        setResults(data.results || []);
    }


    return (
        <div className="relative">
            <input
                value={query}
                onChange={handleSearch}
                placeholder="Search movies..."
                className="bg-surface px-4 py-2 rounded-lg w-35 lg:w-64"
            />


            {results.length > 0 && (
                <div className="absolute top-full left-0 bg-surface w-full rounded-lg mt-2 p-2">
                    {results.slice(0, 5).map((movie) => (
                        <div
                            key={movie.id}
                            className="p-2 hover:bg-bg rounded cursor-pointer"
                        >
                            {movie.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}