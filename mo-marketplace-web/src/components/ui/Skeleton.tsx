import { Box, Skeleton as MuiSkeleton } from '@mui/material';

export function ProductCardSkeleton() {
    return (
        <Box
            sx={{
                background: '#fff',
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
            }}
        >
            <MuiSkeleton variant="rectangular" height={200} />
            <Box sx={{ p: 2 }}>
                <MuiSkeleton variant="text" width="60%" height={28} />
                <MuiSkeleton variant="text" width="90%" />
                <MuiSkeleton variant="text" width="40%" />
            </Box>
        </Box>
    );
}