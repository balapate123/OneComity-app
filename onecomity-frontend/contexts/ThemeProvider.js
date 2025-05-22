import React from 'react';
import { ThemeContext, darkThemeColors } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
  // In the future, we could add logic here to switch themes
  // For now, we are hardcoding the darkThemeColors
  return (
    <ThemeContext.Provider value={darkThemeColors}>
      {children}
    </ThemeContext.Provider>
  );
};
