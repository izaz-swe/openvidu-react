import PropTypes from 'prop-types';
import { Backdrop, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Loader = ({ open, handleClose }) => {
  const theme = useTheme();

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

Loader.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Loader;
