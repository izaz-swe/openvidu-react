import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  Collapse
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout } from '../redux/auth/authSlice';
import { updateDocumentTitle } from '../utils/titleUtils';
import DashboardIcon from '../assets/sidebar/dashboard.svg';
import TransaferIcon from '../assets/sidebar/transfer.png';
import DoctorsIcon from '../assets/images/doctors.png';
import PatientsIcon from '../assets/images/patient.png';
import SettingsIcon from '../assets/sidebar/settings.svg';
import SignOutIcon from '../assets/sidebar/sign-out.svg';
import DoctelLogo from '../assets/sidebar/doctel-logo.svg';
import PackagesIcon from '../assets/sidebar/subscription.png';
import SubscriptionIcon from '../assets/sidebar/susbcriptions-list.png';
import SalesReportIcon from '../assets/sidebar/report.png';

const drawerWidth = 240;
const collapsedDrawerWidth = 70;

const allNavigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/dashboard', roles: ['superadmin', 'dealer'] },
  // { id: 'doctors', label: 'Doctors', icon: DoctorsIcon, path: '/doctors', roles: ['superadmin'] },
  // { id: 'active-doctors', label: 'Active Doctors', icon: DoctorsIcon, path: '/active-doctors', roles: ['superadmin'] },
  // { 
  //   id: 'users', 
  //   label: 'Users', 
  //   icon: PatientsIcon, 
  //   path: '/users', 
  //   roles: ['superadmin'],
  //   hasSubItems: true,
  //   subItems: [
  //     { id: 'agents', label: 'Agents', path: '/users/agents' },
  //     { id: 'patients', label: 'Patients', path: '/users/patients' }
  //   ]
  // },
  //   { 
  //   id: 'sales-report', 
  //   label: 'Sales Report', 
  //   icon: SalesReportIcon, 
  //   path: '/sales-report', 
  //   roles: ['superadmin'],
  //   hasSubItems: true,
  //   subItems: [
  //     { id: 'patients-sales', label: 'Patients', path: 'patient-sales-report' },
  //     { id: 'agents-sales', label: 'Agents', path: 'agent-sales-report' }
  //   ]
  // },
  // { id: 'admins', label: 'Admins', icon: PatientsIcon, path: '/admins', roles: ['superadmin'] },
  // { id: 'dealers', label: 'Dealers', icon: PatientsIcon, path: '/dealers', roles: ['superadmin'] },
  // { id: 'packages', label: 'Packages', icon: PackagesIcon, path: '/packages', roles: ['superadmin'] },
  // { id: 'subscriptions', label: 'Subscriptions', icon: SubscriptionIcon, path: '/subscriptions', roles: ['superadmin'] },
  // { id: 'admintransactions', label: 'Transaction', icon: TransaferIcon, path: '/admintransactions', roles: ['superadmin'] },
  // { id: 'chat', label: 'Chat', icon: <ChatIcon fontSize="small" />, path: '/chat', roles: ['superadmin'] },
  // { id: 'agents', label: 'Agents', icon: PatientsIcon, path: '/agents', roles: ['dealer'] },
  { id: 'room', label: 'Room', icon: TransaferIcon, path: '/room', roles: ['superadmin'] },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings', roles: ['superadmin', 'dealer'] },

  { id: 'sign-out', label: 'Sign Out', icon: SignOutIcon, path: '/logout', roles: ['superadmin', 'dealer'] }
];

const Sidebar = ({ open, mobileOpen, handleDrawerToggle, isMobile }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  const handleNavigation = (path) => {
    if (path === '/logout') {
      dispatch(logout());
    } else {
      navigate(path);
      if (isMobile) handleDrawerToggle();
    }
  };

  const handleToggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const isActive = (path) =>
    location.pathname === path || (path === '/dashboard' && location.pathname === '/');

  const isSubItemActive = (subItems) => {
    return subItems.some(subItem => location.pathname === subItem.path);
  };

  useEffect(() => {
    updateDocumentTitle(location.pathname, allNavigationItems);
  }, [location.pathname]);

  const filteredItems = allNavigationItems.filter(item =>
    item.roles.includes(user?.role)
  );

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          height: '64px',
          px: open ? 3 : 0,
          borderBottom: '1px solid #EAECF0'
        }}
      >
        <img
          src={DoctelLogo}
          alt="DOCTEL"
          style={{ height: open ? '50px' : '24px', width: open ? '120px' : '24px' }}
        />

        {!isMobile && open && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ width: 24, height: 24, p: '4px', color: '#667085' }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <List sx={{ p: 2, '& .MuiListItem-root': { mb: 1 } }}>
        {filteredItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.hasSubItems) {
                    handleToggleExpand(item.id);
                  } else {
                    handleNavigation(item.path);
                  }
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'flex-start' : 'center',
                  px: 1.5,
                  py: 1.5,
                  borderRadius: '6px',
                  backgroundColor: (item.hasSubItems ? isSubItemActive(item.subItems) : isActive(item.path)) ? '#20ACE2' : 'transparent',
                  color: (item.hasSubItems ? isSubItemActive(item.subItems) : isActive(item.path)) ? '#FFF' : '#737791',
                  '&:hover': {
                    backgroundColor: (item.hasSubItems ? isSubItemActive(item.subItems) : isActive(item.path)) ? '#20ACE2' : '#F9FAFB'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 1.5 : 0,
                    justifyContent: 'center',
                    color: (item.hasSubItems ? isSubItemActive(item.subItems) : isActive(item.path)) ? '#FFF' : '#667085'
                  }}
                >
                  {typeof item.icon === 'string' ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      style={{
                        width: 20,
                        height: 20,
                        filter: (item.hasSubItems ? isSubItemActive(item.subItems) : isActive(item.path))
                          ? 'brightness(0) invert(1)'
                          : 'brightness(0) saturate(100%) invert(48%) sepia(9%) saturate(669%) hue-rotate(202deg) brightness(93%) contrast(89%)'
                      }}
                    />
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>

                {open && (
                  <>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: 16,
                          fontWeight: (item.hasSubItems ? isSubItemActive(item.subItems) : isActive(item.path)) ? 600 : 400,
                          lineHeight: '30px'
                        }
                      }}
                    />
                    {item.hasSubItems && (
                      <IconButton
                        size="small"
                        sx={{ 
                          color: (item.hasSubItems ? isSubItemActive(item.subItems) : isActive(item.path)) ? '#FFF' : '#667085',
                          ml: 1
                        }}
                      >
                        {expandedItems[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    )}
                  </>
                )}
              </ListItemButton>
            </ListItem>
            
            {item.hasSubItems && open && (
              <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleNavigation(subItem.path)}
                        sx={{
                          minHeight: 40,
                          pl: 4,
                          pr: 1.5,
                          py: 1,
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          color: isActive(subItem.path) ? '#20ACE2' : '#737791',
                          '&:hover': {
                            backgroundColor: '#F9FAFB'
                          }
                        }}
                      >
                        <ListItemText
                          primary={`• ${subItem.label}`}
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: 14,
                              fontWeight: isActive(subItem.path) ? 600 : 400,
                              lineHeight: '24px',
                              color: isActive(subItem.path) ? '#20ACE2' : '#737791'
                            }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderRight: '1px solid #EAECF0',
            boxSizing: 'border-box'
          }
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen
            }),
            borderRight: '1px solid #EAECF0',
            backgroundColor: '#FFF'
          }
        }}
      >
        {drawerContent}

        {!open && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: 'absolute',
              right: 0,
              top: 52,
              backgroundColor: '#FFF',
              border: '1px solid #EAECF0',
              boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
              width: 24,
              height: 24,
              p: '4px',
              '&:hover': { backgroundColor: '#FFF' }
            }}
          >
            <ChevronRightIcon fontSize="small" sx={{ color: '#667085' }} />
          </IconButton>
        )}
      </Drawer>
    </>
  );
};

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

Sidebar.defaultProps = {
  isMobile: false
};

export default Sidebar;
