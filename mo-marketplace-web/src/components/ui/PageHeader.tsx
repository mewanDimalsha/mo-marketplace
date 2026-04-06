import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Props {
    title: string;
    subtitle?: string;
    backTo?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function PageHeader({
    title,
    subtitle,
    backTo,
    action,
}: Props) {
    const navigate = useNavigate();

    return (
        <Box mb={4}>
            {backTo && (
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(backTo)}
                    sx={{ mb: 2, color: 'text.secondary' }}
                >
                    Back
                </Button>
            )}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {action && (
                    <Button variant="contained" onClick={action.onClick}>
                        {action.label}
                    </Button>
                )}
            </Box>
        </Box>
    );
}