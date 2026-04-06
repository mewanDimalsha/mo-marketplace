import { Button, CircularProgress, Box } from '@mui/material';

interface Props {
    loading: boolean;
    children: React.ReactNode;
    fullWidth?: boolean;
    type?: 'submit' | 'button';
    onClick?: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'error' | 'inherit';
    disabled?: boolean;
}

export default function LoadingButton({
    loading,
    children,
    fullWidth = true,
    type = 'submit',
    onClick,
    variant = 'contained',
    color = 'primary',
    disabled = false,
}: Props) {
    return (
        <Button
            type={type}
            variant={variant}
            color={color}
            fullWidth={fullWidth}
            size="large"
            disabled={loading || disabled}
            onClick={onClick}
            sx={{ mt: 1 }}
        >
            {loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={18} color="inherit" />
                    Please wait...
                </Box>
            ) : (
                children
            )}
        </Button>
    );
}