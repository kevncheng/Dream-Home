import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
    typography: {
        fontFamily: '"Roboto"'
    },
    palette: {
        primary: {
            main: '#212121'
        },
        secondary: {
            main: '#fafafa'
        },
        error: {
            main: '#d8000c'
        },
        bgcolor: {
            main: '#f6f6f6'
        }
    },
    overrides: {
        MuiButton: {
            root: {
                textTransform: 'none',
                minWidth: 120,
                border: '1px #ddd solid',
                backgroundColor: '#fff',
                borderRadius: 25,
                minHeight: 30
            },
            contained: {
                boxShadow: 'none'
            }
        },
        MuiTabs: {
            root: {
                display: 'flex',
                backgroundColor: 'transparent'
            },
            indicator: {
                display: 'none'
            }
        },
        MuiTab: {
            root: {
                textTransform: 'none',
                color: 'black',
                minWidth: 120,
                border: '1px #ddd solid',
                backgroundColor: '#fff',
                fontWeight: 'regular',
                fontSize: '1rem',
                marginRight: '1rem',
                borderRadius: 25,
                minHeight: 20,
                '&$selected': {
                    opacity: 1,
                    color: '#fff',
                    backgroundColor: 'black'
                }
            }
        },
        MuiInput: {
            input: {
                textAlign: 'center',
                '&::placeholder': {
                    color: 'black',
                    opacity: 1
                }
            }
        },
        MuiFormHelperText: {
            root: {
                textAlign: 'center'
            }
        }
    }
});
