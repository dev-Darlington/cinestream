import { TMDBMovie } from "@/types/tmdb";
import { useFavorites } from "@/contexts/favoritesContext";


interface Props {
    movie: TMDBMovie;
}


export default function FavoriteButton({ movie }: Props) {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();


    const favorite = isFavorite(movie.id);


    function toggle() {
        if (favorite) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }
    }


    return (
        <button
            onClick={toggle}
            className={`px-4 py-2 rounded-xl transition font-semibold
${favorite
                    ? "bg-red-500 text-white"
                    : "bg-surface text-textPrimary hover:bg-accent"
                }`}
        >
            {favorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
        </button>
    );
}