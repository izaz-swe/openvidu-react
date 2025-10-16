import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const Layout = () => {
    const navbarHeight = 44; 

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: '#F9F9F9',
                position: 'relative',
            }}
        >
            <Navbar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: `${navbarHeight}px`, 
                    display: 'flex',
                    flexDirection: 'column',
                    pb: 3,
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        py: { xs: 2, sm: 3, md: 4 },
                        px: { xs: 2, sm: 3, md: 3 }
                    }}
                >
                    <Outlet />
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default Layout;