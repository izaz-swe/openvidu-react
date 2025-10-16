import { Box, Typography, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchSuperadminCounts } from '../../redux/super-admin/superAdminSlice';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import SuperAdminIcon from '@mui/icons-material/Security';
import DealerIcon from '@mui/icons-material/Store';
import DoctorIcon from '@mui/icons-material/MedicalServices';
import PatientIcon from '@mui/icons-material/PersonalInjury';
import AgentIcon from '@mui/icons-material/SupportAgent';

const AdminCardsSection = () => {
    const { token } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (token) {
            dispatch(fetchSuperadminCounts(token));
        }
    }, [dispatch, token]);
    
    const { counts, isLoading, error } = useSelector(state => state.admin);


    const cards = [
        {
            title: "Admins",
            value: counts?.admins,
            icon: <AdminIcon />,
            color: "#000",
            bg: "#FFE2E5",
            iconBg: "rgba(255, 107, 107, 0.1)"
        },
        {
            title: "Super Admins",
            value: counts?.superadmins,
            icon: <SuperAdminIcon />,
            color: "#000",
            bg: "#FFF4DE",
            iconBg: "rgba(255, 184, 0, 0.1)"
        },
        {
            title: "Dealers",
            value: counts?.dealers,
            icon: <DealerIcon />,
            color: "#000",
            bg: "#DCFCE7",
            iconBg: "rgba(0, 184, 0, 0.1)"
        },
        {
            title: "Doctors",
            value: counts?.doctors,
            icon: <DoctorIcon />,
            color: "#000",
            bg: "#E1F5FE",
            iconBg: "rgba(3, 169, 244, 0.1)"
        },
        {
            title: "Patients",
            value: counts?.patients,
            icon: <PatientIcon />,
            color: "#000",
            bg: "#F3E5F5",
            iconBg: "rgba(156, 39, 176, 0.1)"
        },
        {
            title: "Agents",
            value: counts?.agents,
            icon: <AgentIcon />,
            color: "#000",
            bg: "#E8F5E9",
            iconBg: "rgba(76, 175, 80, 0.1)"
        }
    ];

    if (error) {
        return <Typography color="error">Error: {error.message || "Failed to load counts"}</Typography>;
    }

    return (
        <Box sx={{
            width: '100%',
            p: 3,
            borderRadius: 2,
            bgcolor: "white",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
                gap: 2
            }}>
                {cards.map((card, index) => (
                    <Box
                        key={index}
                        sx={{
                            p: 3,
                            bgcolor: card.bg,
                            borderRadius: 2,
                            boxShadow: "none",
                            position: "relative",
                            overflow: "hidden",
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 0
                        }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                bgcolor: card.iconBg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 2
                            }}
                        >
                            {isLoading ? (
                                <Skeleton variant="circular" width={24} height={24} />
                            ) : (
                                <Box sx={{ color: 'inherit' }}>
                                    {card.icon}
                                </Box>
                            )}
                        </Box>
                        
                        {isLoading ? (
                            <>
                                <Skeleton variant="text" width="60%" height={40} sx={{ mb: 0.5 }} />
                                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                            </>
                        ) : (
                            <>
                                <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    {card.value || "0"}
                                </Typography>
                                <Typography variant="body2" fontWeight="medium" color="text.secondary" sx={{ mb: 1 }}>
                                    {card.title}
                                </Typography>
                            </>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default AdminCardsSection;