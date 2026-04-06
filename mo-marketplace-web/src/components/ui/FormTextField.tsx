import { TextField } from '@mui/material';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
    label: string;
    type?: string;
    registration: UseFormRegisterReturn;
    error?: string;
    autoComplete?: string;
}

export default function FormTextField({
    label,
    type = 'text',
    registration,
    error,
    autoComplete,
}: Props) {
    return (
        <TextField
            label={label}
            type={type}
            fullWidth
            autoComplete={autoComplete}
            {...registration}
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
        />
    );
}