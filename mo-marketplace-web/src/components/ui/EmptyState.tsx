import { Box, Typography, Button } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';

interface Props {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    message,
    actionLabel,
    onAction,
}: Props) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={10}
            color="text.secondary"
        >
            <SentimentDissatisfied
                sx={{ fontSize: 64, mb: 2, opacity: 0.3 }}
            />
            <Typography variant="h6" mb={2}>
                {message}
            </Typography>
            {actionLabel && onAction && (
                <Button variant="contained" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}