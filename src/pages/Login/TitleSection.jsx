import { Box, Typography } from '@mui/material';

const TitleSection = ({ isMobile, showOtpVerify }) => (
  <Box sx={{ mb: { xs: 3, sm: 4 } }}>
    <Typography
      variant={isMobile ? "h6" : "h5"}
      component="h2"
      sx={{
        display: 'block',
        paddingBottom: 0.5,
        marginBottom: 1,
        fontSize: { xs: '20px', sm: '24px', md: '28px' },
        fontWeight: showOtpVerify ? 500 : 700,
        color: '#0052A8',
        textAlign: 'center' // Center only the title
      }}
    >
      Welcome Back
    </Typography>
    <Typography
      variant="body1"
      component="p"
      sx={{
        fontSize: { xs: '14px', sm: '16px' },
        color: 'text.secondary',
        mt: 1,
        textAlign: 'left' // Explicitly align subtitle to left
      }}
    >
      Log in to your account to continue
    </Typography>
  </Box>
);

export default TitleSection;