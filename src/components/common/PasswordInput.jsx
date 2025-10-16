import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlined from '@mui/icons-material/LockOutlined'; // Import the lock icon

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  error,
  fullWidth = true,
  required = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      label={label}
      name={name}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={error}
      fullWidth={fullWidth}
      required={required}
      margin="normal"
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockOutlined color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default PasswordInput;