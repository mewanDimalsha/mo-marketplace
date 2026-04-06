import { Box } from '@mui/material';
import Navbar from './Navbar';

interface Props {
    children: React.ReactNode;
    maxWidth?: number;
    centered?: boolean;
    showNavbar?: boolean;
}

export default function PageWrapper({
    children,
    maxWidth = 1100,
    centered = false,
    showNavbar = false,
}: Props) {
    if (centered) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: 2,
                }}
            >
                {children}
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: '#f9fafb' }}>
            {showNavbar && <Navbar />}
            <Box sx={{ maxWidth, margin: '0 auto', padding: '32px 16px' }}>
                {children}
            </Box>
        </Box>
    );
}