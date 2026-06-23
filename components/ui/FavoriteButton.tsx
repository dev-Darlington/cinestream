import { useState, useEffect } from "react"
import { TMDBMovie } from "@/types/tmdb";
import { useFavorites } from "@/contexts/favoritesContext";
import { FaHeart } from "react-icons/fa6";

interface Props {
    movie: TMDBMovie;
}

export default function FavoriteButton({ movie }: Props) {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const [mounted, setMounted] = useState(false)

    const favorite = isFavorite(movie.id);

    function toggle() {
        if (favorite) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-12 h-12 rounded-xl bg-surface border border-white/5 animate-pulse" />
        );
    }

    return (
        <button
            onClick={toggle}
            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer active:scale-95 ${
                favorite
                    ? "bg-red-500/15 border-red-500/40 text-red-500 shadow-md shadow-red-500/10"
                    : "bg-surface border-white/5 text-textSecondary hover:text-red-400 hover:border-red-500/30"
            }`}
            title={favorite ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={favorite ? "Remove from Favorites" : "Add to Favorites"}
        >
            <FaHeart 
                size={18} 
                className={`transition-transform duration-300 ${
                    favorite ? "scale-110 animate-heart-pop" : "opacity-70 group-hover:opacity-100"
                }`} 
            />
        </button>
    );
}