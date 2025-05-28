import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize with saved color from localStorage or default to white
  const [backgroundColor, setBackgroundColor] = useState<string>(() => {
    const savedColor = localStorage.getItem('backgroundColor');
    return savedColor || '#ffffff';
  });

  // Apply the background color immediately when component mounts
  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', backgroundColor);
    // Also apply directly to body for immediate effect
    document.body.style.backgroundColor = backgroundColor;
  }, []);

  // Save theme to localStorage and update CSS when color changes
  useEffect(() => {
    localStorage.setItem('backgroundColor', backgroundColor);
    document.documentElement.style.setProperty('--bg-color', backgroundColor);
    // Apply directly to body for immediate effect
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  return ( 
    <ThemeContext.Provider value={{ backgroundColor, setBackgroundColor }}>
      {children}
    </ThemeContext.Provider>
  );
};