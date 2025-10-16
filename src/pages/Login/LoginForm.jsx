import { useDispatch } from 'react-redux';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Link
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import showToast from '../../utils/toast';
import PropTypes from 'prop-types';
import './Auth.css';
import { createAdminLogin } from '../../redux/auth/authSlice';
import FormInput from '../../components/common/FormInput';
import PasswordInput from '../../components/common/PasswordInput';

const LoginForm = ({ email, setEmail, password, setPassword, isLoading }) => {
    const dispatch = useDispatch();
    // const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isValidEmail = (email) => true;

    const isValidPassword = (password) => password.length >= 6;
    const handleLogin = async () => {
        if (!isValidEmail(email)) {
            showToast('error', "Please enter a valid email address");
            return;
        }
        if (!isValidPassword(password)) {
            showToast('error', "Password must be at least 6 characters long");
            return;
        }
        const username = email;
        dispatch(createAdminLogin({ username, password }));
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        showToast('info', 'Enter your email to reset your password');
        // You might want to navigate to forgot password page here
        // navigate('/forgot-password');
    };

    return (
        <Box sx={{ mb: 4 }}>

            <FormInput
                required
                name="email"
                label="User Name"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                error={email && !isValidEmail(email)}
                InputProps={{
                    startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#DDE2E5',
                        },
                        '&:hover fieldset': {
                            borderColor: '#DDE2E5',
                        },
                        backgroundColor: '#EFF1F94D',
                    },
                }}
                fullWidth
                margin="normal"
            />

            <PasswordInput
                required
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#DDE2E5',
                        },
                        '&:hover fieldset': {
                            borderColor: '#DDE2E5',
                        },
                        backgroundColor: '#EFF1F94D',
                    },
                }}
                fullWidth
                margin="normal"
            />

            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={handleForgotPassword}
                        sx={{
                            textDecoration: 'none',
                            color: 'text.secondary',
                            mb: 2
                        }}
                    >
                        Forgot password?
                    </Link>
                </Grid>
            </Grid>

            <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                disabled={!isValidEmail(email) || !isValidPassword(password) || isLoading}
                sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    backgroundColor: isValidEmail(email) && isValidPassword(password) && !isLoading ? '#0052A8' : undefined,
                    '&:hover': {
                        backgroundColor: isValidEmail(email) && isValidPassword(password) && !isLoading ? '#00438a' : undefined,
                    }
                }}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login Now'}
            </Button>
        </Box>
    );
};

LoginForm.propTypes = {
    email: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

LoginForm.defaultProps = {
    isLoading: false
};

export default LoginForm;