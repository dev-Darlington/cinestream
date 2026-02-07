"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TMDBMovie } from '@/types/tmdb'

interface FavoritesContextType {
    favorites: TMDBMovie[];
    addFavorite: (movie: TMDBMovie) => void;
    removeFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
    undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<TMDBMovie[]>(() => {
        if (typeof window === "undefined") return [];
        try {
            const stored = localStorage.getItem("favorites");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });


    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    function addFavorite(movie: TMDBMovie) {
        setFavorites((prev) => {
            if (prev.find((m) => m.id === movie.id)) return prev;
            return [...prev, movie];
        });
    }


    function removeFavorite(id: number) {
        setFavorites((prev) => prev.filter((m) => m.id !== id));
    }


    function isFavorite(id: number) {
        return favorites.some((m) => m.id === id);
    }

    return (
        <FavoritesContext.Provider
            value={{ favorites, addFavorite, removeFavorite, isFavorite }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used inside FavoritesProvider");
    }
    return context;
}