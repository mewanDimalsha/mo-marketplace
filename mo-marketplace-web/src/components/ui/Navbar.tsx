import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Chip,
} from '@mui/material';
import { ShoppingBag, Add, Logout } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: '#fff',
                borderBottom: '1px solid #e5e7eb',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>

                {/* ── LEFT: Logo ── */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    onClick={() => navigate('/')}
                    sx={{ cursor: 'pointer' }}
                >
                    <ShoppingBag sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        color="primary.main"
                    >
                        MO Marketplace
                    </Typography>
                </Box>

                {/* ── RIGHT: Actions ── */}
                <Box display="flex" alignItems="center" gap={2}>
                    {isAuthenticated ? (
                        <>
                            {/* User chip */}
                            <Chip
                                avatar={
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        {user?.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                label={user?.name}
                                variant="outlined"
                                sx={{ fontWeight: 500 }}
                            />

                            {/* Create product button */}
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => navigate('/create')}
                                size="small"
                            >
                                New Product
                            </Button>

                            {/* Logout */}
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<Logout />}
                                onClick={handleLogout}
                                size="small"
                                sx={{ color: '#6b7280', borderColor: '#e5e7eb' }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="text"
                                onClick={() => navigate('/login')}
                                sx={{ color: '#6b7280' }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/register')}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>

            </Toolbar>
        </AppBar>
    );
}