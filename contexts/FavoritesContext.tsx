import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FavoritesContextType {
    favorites: string[]; // List of product IDs
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useState<string[]>([]);

    const toggleFavorite = (productId: string) => {
        setFavorites((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const isFavorite = (productId: string) => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
