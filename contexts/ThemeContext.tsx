import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ThemeColors {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryText: string;
}

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    setDarkMode: (value: boolean) => void;
    colors: ThemeColors;
}

const lightColors: ThemeColors = {
    background: '#FFFFFF',
    surface: '#F5F7FA',
    surfaceSecondary: '#FFFFFF',
    text: '#1a2632',
    textSecondary: '#8B9DB8',
    border: '#E8EEF5',
    primary: '#0F1B28',
    primaryText: '#FFFFFF',
};

const darkColors: ThemeColors = {
    background: '#0F1B28',
    surface: '#1a2632',
    surfaceSecondary: '#243447',
    text: '#FFFFFF',
    textSecondary: '#8B9DB8',
    border: '#2d3e50',
    primary: '#4A90D9',
    primaryText: '#FFFFFF',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const setDarkMode = (value: boolean) => {
        setIsDarkMode(value);
    };

    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
