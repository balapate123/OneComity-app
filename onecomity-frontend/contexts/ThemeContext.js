import React, { createContext } from 'react';

export const darkThemeColors = {
    primaryBackground: '#121212',
    secondaryBackground: '#1E1E1E',
    tertiaryBackground: '#2C2C2C',
    accentGreen: '#00E676',
    accentRed: '#FF3D00',
    primaryText: '#E0E0E0',
    secondaryText: '#A0A0A0',
    disabledText: '#707070',
    borderColor: '#404040',
    buttonDefaultBackground: '#00E676', // accentGreen
    buttonDefaultText: '#FFFFFF',
    inputBackground: '#2C2C2C', // tertiaryBackground
    inputBorderColor: '#404040', // borderColor
    inputTextColor: '#E0E0E0', // primaryText
    // Add any other colors that might be useful globally
    statusBarColor: '#121212', // Same as primary background
    headerBackground: '#1E1E1E', // secondaryBackground for navigator headers
    headerTintColor: '#E0E0E0', // primaryText for header titles/icons
};

export const ThemeContext = createContext(darkThemeColors);
