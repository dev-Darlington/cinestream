import { useFavorites } from '@/contexts/favoritesContext'
import Image from "next/image";
import Link from "next/link";


export default function FavoritesPage() {
    const { favorites, removeFavorite } = useFavorites();


    return (
        <div className="min-h-screen bg-bg text-textPrimary px-6 py-10">
            <h1 className="text-4xl font-bold mb-8">My Favorites</h1>


            {favorites.length === 0 && (
                <p className="text-textSecondary">No favorites yet. Start exploring movies 🎬</p>
            )}


            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {favorites.map((movie) => (
                    <div
                        key={movie.id}
                        className="bg-surface rounded-xl overflow-hidden hover:scale-105 transition"
                    >
                        <Link href={`/movie/${movie.id}`}>
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                width={300}
                                height={450}
                                className="object-cover"
                            />
                        </Link>


                        <div className="p-3">
                            <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
                            <button
                                onClick={() => removeFavorite(movie.id)}
                                className="text-red-400 text-xs mt-2 hover:text-red-300"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}