import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface CartItem {
    id: string;
    category: string;
    name: string;
    price: number;
    oldPrice: number;
    quantity: number;
    color: string;
    colorHex: string;
    image: any;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, color: string) => void;
    updateQuantity: (id: string, color: string, quantity: number) => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCartItems(prevItems => {
            // Check if item with same id and color already exists
            const existingItemIndex = prevItems.findIndex(
                cartItem => cartItem.id === item.id && cartItem.colorHex === item.colorHex && cartItem.category === item.category
            );

            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += item.quantity;
                return updatedItems;
            } else {
                // Add new item
                return [...prevItems, item];
            }
        });
    };

    const removeFromCart = (id: string, color: string) => {
        setCartItems(prevItems =>
            prevItems.filter(item => !(item.id === id && item.colorHex === color))
        );
    };

    const updateQuantity = (id: string, color: string, quantity: number) => {
        if (quantity < 1) return;

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id && item.colorHex === color
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                getTotalPrice,
                getTotalItems,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
