import { TextField } from '@mui/material';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  fullWidth = true,
  required = false,
  ...props
}) => {
  const displayLabel = required ? `${label} *` : label;

  return (
    <TextField
      label={displayLabel}
      name={name}
      type={type}
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
      {...props}
    />
  );
};

export default FormInput;