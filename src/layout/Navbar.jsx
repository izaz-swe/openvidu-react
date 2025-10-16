import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Avatar,
  InputBase,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  backgroundColor: '#F5F5F5',
  '&:hover': {
    backgroundColor: '#EEEEEE',
  },
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '300px',
  },
  border: '1px solid #E0E0E0',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#9E9E9E',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#424242',
  '& .MuiInputBase-input': {
    padding: '10px 10px 10px 0',
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    fontSize: '14px',
  },
}));

const StatusBadge = styled('span')(({ status }) => ({
  width: 8,
  height: 8,
  backgroundColor:
    status === 'online' ? '#4CAF50' :
      status === 'busy' ? '#FF9800' :
        '#9E9E9E',
  borderRadius: '50%',
  display: 'inline-block',
  marginRight: 8,
}));

const Navbar = ({ drawerWidth = 240, handleDrawerToggle }) => {
  const { user } = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [status, setStatus] = useState('online');

  const handleStatusClick = (event) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleStatusClose = () => {
    setStatusAnchorEl(null);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    handleStatusClose();
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'busy': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#4CAF50';
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        boxShadow: 'none',
        backgroundColor: '#FFFFFF',
        color: '#424242',
        borderBottom: '1px solid #E0E0E0',
        height: '64px',
        justifyContent: 'center'
      }}
      elevation={0}
    >
      <Toolbar sx={{
        minHeight: '64px !important',
        paddingLeft: { xs: '16px', md: '24px' },
        paddingRight: { xs: '16px', md: '24px' },
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                color: '#424242',
                display: { md: 'none' }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <Link to='/doctor/profile'>
              <Avatar
                // src={userDetails?.profileImage}
                alt="Profile"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              />
            </Link>
            {!isMobile && (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                ml: '12px'
              }}>
                <Typography
                  variant="subtitle2"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '20px'
                  }}
                >
                 {user?.name}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={handleStatusClick}
                >
                  <StatusBadge status={status} />
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      color: getStatusColor(),
                      fontSize: '12px',
                      lineHeight: '16px'
                    }}
                  >
                    {getStatusText()}
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ color: '#9E9E9E', fontSize: '14px', ml: 0.5 }} />
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          width: { xs: '40%', sm: 'auto' },
          zIndex: { xs: -1, sm: 'auto' }
        }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search here..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          pr: { xs: 0, sm: 2 }
        }}>
          <Tooltip title="Notifications">
            <IconButton
              size="medium"
              aria-label="show notifications"
              sx={{
                color: '#FFA412',
                backgroundColor: '#FFFAF1',
                '&:hover': {
                  backgroundColor: '#EEEEEE'
                }
              }}
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={1} color="error">
                <NotificationsIcon fontSize="medium" />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={statusAnchorEl}
        open={Boolean(statusAnchorEl)}
        onClose={handleStatusClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            minWidth: '150px',
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              padding: '8px 16px'
            }
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleStatusChange('online')}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StatusBadge status="online" />
            <Typography variant="body2">Online</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('busy')}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StatusBadge status="busy" />
            <Typography variant="body2">Busy</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('offline')}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StatusBadge status="offline" />
            <Typography variant="body2">Offline</Typography>
          </Box>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            width: 320,
            '& .MuiMenuItem-root': {
              padding: '12px 16px'
            }
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
              New message from patient
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px' }}>
              10 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
              Appointment confirmed
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px' }}>
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};
Navbar.propTypes = {
  drawerWidth: PropTypes.number,
  handleDrawerToggle: PropTypes.func.isRequired
};

Navbar.defaultProps = {
  drawerWidth: 240
};

export default Navbar;