import { useState, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { 
  Box, 
  useTheme, 
  useMediaQuery, 
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const drawerWidth = 240;
const collapsedDrawerWidth = 70;
const navbarHeight = 64;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile' })(
  ({ theme, open, isMobile }) => ({
    flexGrow: 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: isMobile ? '100%' : `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
    marginLeft: isMobile ? 0 : open ? drawerWidth : collapsedDrawerWidth,
    marginTop: navbarHeight,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      width: '100%',
    },
  }),
);

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <CircularProgress />
  </Box>
);

const AdminAppLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  if (!isAuthenticated || user.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Navbar 
        handleDrawerToggle={handleDrawerToggle} 
        drawerWidth={isMobile ? 0 : sidebarOpen ? drawerWidth : collapsedDrawerWidth} 
      />
      
      <Sidebar 
        open={sidebarOpen}
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedDrawerWidth}
      />
      
      <Main open={sidebarOpen} isMobile={isMobile}>
        <Box 
          sx={{ 
            height: `calc(100vh - ${navbarHeight}px)`,
            overflow: 'auto',
            backgroundColor: '#f5f8fa',
            p: { xs: 2, sm: 3 }
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </Box>
      </Main>
    </Box>
  );
};

export default AdminAppLayout;