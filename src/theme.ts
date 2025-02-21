import { createTheme, PaletteMode, ThemeOptions } from "@mui/material";

const themeProperties = {
    dark: {
        primary: {
            main: '#060823',
            contrastText: '#fff',
            light: '#F5F5F5'
        },
        secondary: {
            main: '#697BC3',
        }
    },
    light: {
        primary: {
            main: '#D6E6FF',
            contrastText: 'rgba(0, 0, 0, 0.87)',
            light: '#F5F5F5'
        },
        secondary: {
            main: '#697BC3',
        }
    }
}
// kuugilfylsjkuflytk
export const applyThemeOptions: (mode: PaletteMode) => ThemeOptions = (mode) => {
    const theme = themeProperties[mode];
    return createTheme({
        palette: {
            mode,
            ...theme,
        },
        components: {
            MuiLink: {
                styleOverrides: {
                    root: {
                        color: theme.primary.contrastText
                    }
                }
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        color: theme.primary.contrastText
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    contained: {
                        background: theme.secondary.main
                        // root: {
                        // }
                    },
                    text: {
                        color: theme.primary.contrastText,
                    }
                }
            },
        }
    })
}