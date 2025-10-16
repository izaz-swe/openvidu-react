import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  useMediaQuery
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Loader from '../../components/loader/Loader';
import showToast from '../../utils/toast';
import HeaderSection from './HeaderSection';
import TitleSection from './TitleSection';
import LoginForm from './LoginForm';
import FooterSection from './FooterSection';
import { errorClean } from '../../redux/auth/authSlice';

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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0052A8',
          },
        },
      },
    },
  },
});

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, isLoading, error, errorMessage } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (error) {
      showToast('error', errorMessage || 'An error occurred');
      const timer = setTimeout(() => {
        dispatch(errorClean());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, errorMessage, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      showToast('success','Login successful')
    }
  }, [isAuthenticated, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#F9F9F9',
          justifyContent: 'center', // Changed from flex-start to center
          alignItems: 'center',
          p: { xs: 2, sm: 3 } // Added padding instead of pt/px
        }}
      >
        <Loader open={isLoading} />
        <Container 
          maxWidth="sm" 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 2,
              backgroundColor: 'white',
              width: '100%'
            }}
          >
            <HeaderSection isMobile={isMobile} />
            <TitleSection isMobile={isMobile} />
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
            />
            {/* <FooterSection /> */}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginScreen;