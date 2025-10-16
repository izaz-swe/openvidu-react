import { Box, Typography, Skeleton } from '@mui/material';
import edictIconSvg from '../../assets/icons/call-statistics.svg';
import CallListIconSvg from '../../assets/icons/call-list.svg';
import CallTableIconSvg from '../../assets/icons/edit-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchDealerInfo } from '../../redux/dealer/dealerSlice';

const CardsSection = () => {
    const { token } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        if (token) {
            dispatch(fetchDealerInfo(token))
        }
    }, [dispatch, token]);
    
    const { dealerInfo, isLoading, error } = useSelector(state => state.dealer);
    console.log("data",dealerInfo)

    const cards = [
        {
            title: "Total Calls Purchased",
            value: dealerInfo?.totalCallsPurchased,
            icon: CallTableIconSvg,
            color: "#000",
            bg: "#FFE2E5",
            iconBg: "rgba(255, 107, 107, 0.1)"
        },
        {
            title: "Sold Calls",
            value: dealerInfo?.soldCalls,
            icon: CallListIconSvg,
            color: "#000",
            bg: "#FFF4DE",
            iconBg: "rgba(255, 184, 0, 0.1)"
        },
        {
            title: "Remaining Calls",
            value: dealerInfo?.remainingCalls,
            icon: edictIconSvg,
            color: "#000",
            bg: "#DCFCE7",
            iconBg: "rgba(0, 184, 0, 0.1)"
        }
    ];

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
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
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
            }}>
                {cards.map((card, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: 1,
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
                                <Box
                                    component="img"
                                    src={card.icon}
                                    alt={card.title}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                    }}
                                />
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
export default CardsSection;