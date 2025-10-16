import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSuperAdmins, updateSuperAdminStatus } from '../../redux/super-admin/superAdminSlice';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Paper,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const AdminsScreen = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const {
    data: superAdmins,
    meta,
    isLoading,
    error,
    errorMessage
  } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSuperAdmin, setCurrentSuperAdmin] = useState(null);
  const [status, setStatus] = useState('active');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(fetchSuperAdmins({
      page: page + 1,
      limit: rowsPerPage,
      phone: searchTerm,
      token
    }));
  }, [dispatch, page, rowsPerPage, searchTerm, token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleEditClick = (superAdmin) => {
    setCurrentSuperAdmin(superAdmin);
    setStatus(superAdmin.status || 'active');
    setEditModalOpen(true);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      await dispatch(updateSuperAdminStatus({
        id: currentSuperAdmin.id,
        status,
        token
      })).unwrap();
      setEditModalOpen(false);
      showSnackbar('Super Admin updated successfully', 'success');
      dispatch(fetchSuperAdmins({
        page: page + 1,
        limit: rowsPerPage,
        phone: searchTerm,
        token
      }));
    } catch (err) {
      showSnackbar(err.message || 'Failed to update super admin', 'error');
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getStatusStyle = (status) => {
    return {
      backgroundColor: status === 'active' ? '#4caf50' : '#f44336',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      display: 'inline-block',
      minWidth: '70px',
      textAlign: 'center'
    };
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Super Admins List
      </Typography>

      {/* Search Bar */}
      <Paper
        elevation={1}
        sx={{
          mb: 3,
          maxWidth: 400,
          borderRadius: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search super admins by phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#20ACE2' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 1,
              '& fieldset': { border: 'none' },
              padding: '2px 4px'
            }
          }}
        />
      </Paper>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{errorMessage}</Typography>
      ) : (
        <>
          {/* Super Admins Table */}
          <TableContainer
            sx={{
              mb: 1,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              boxShadow: '0px 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Profile</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {superAdmins.length > 0 ? (
                  superAdmins.map((superAdmin) => (
                    <TableRow
                      key={superAdmin.id}
                      hover
                      sx={{
                        '&:hover': { backgroundColor: '#f9f9f9' }
                      }}
                    >
                      <TableCell>
                        <Avatar
                          alt={superAdmin.firstName ? `${superAdmin.firstName} ${superAdmin.lastName}` : 'Super Admin'}
                          src={superAdmin.profileImage || 'https://i.pravatar.cc/150?img=3'}
                        />
                      </TableCell>
                      <TableCell>
                        {superAdmin.name}
                      </TableCell>
                      <TableCell sx={{ wordBreak: 'break-word' }}>
                        {superAdmin.email || 'N/A'}
                      </TableCell>
                      <TableCell>{superAdmin.phone}</TableCell>
                      <TableCell>
                        <span style={getStatusStyle(superAdmin.status)}>
                          {superAdmin.status || 'inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEditClick(superAdmin)}
                          color="primary"
                          aria-label="edit"
                          sx={{ color: '#20ACE2' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'red' }}>
                      No super admins found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Table Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={meta.totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              overflow: 'hidden'
            }}
          />
        </>
      )}

      {/* Edit Super Admin Dialog */}
      <Dialog open={editModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Super Admin
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 2 }}>
            {/* Status dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
            disabled={status === (currentSuperAdmin?.status || 'active')}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminsScreen;