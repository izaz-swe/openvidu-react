import { Box } from '@mui/system';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Router from './routes/Router';
import { useRoutes } from 'react-router-dom';
import { TitleProvider } from './context/TitleContext';
import { Toaster } from 'react-hot-toast';
import { PrimeReactProvider } from 'primereact/api';

const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#0052A8',
    },
    background: {
      default: '#F9F9F9',
    },
    text: {
      primary: '#375560',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const App = () => {
  const routing = useRoutes(Router);
  return (
    <ThemeProvider theme={theme}>
      <TitleProvider>
      <PrimeReactProvider>
        <CssBaseline />
        <Box className="App">
          {routing}
        </Box>
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        }}
      />
      </PrimeReactProvider>
      </TitleProvider>
    </ThemeProvider>
  );
};

export default App;