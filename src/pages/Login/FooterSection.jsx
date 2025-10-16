import { Box, Typography, Divider, Link } from '@mui/material';

const FooterSection = () => (
  <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
    <Divider sx={{ my: 2 }} />
    <Box sx={{ textAlign: 'left' }}>
      <Typography variant="body2">
        <Link
          href="#"
          color="#0052A8"
          underline="hover"
          sx={{ fontWeight: 500 }}
        >
          Learn more
        </Link>
        <Typography component="span" variant="body2" color="#375560">
          {' '}about our telemedicine platform
        </Typography>
      </Typography>
    </Box>
  </Box>
);

export default FooterSection;