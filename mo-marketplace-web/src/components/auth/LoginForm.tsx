import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Alert,
    Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormTextField from '../ui/FormTextField';
import LoadingButton from '../ui/LoadingButton';

// ─── SCHEMA ─────────────────────────────────────────────

const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── PROPS ──────────────────────────────────────────────

interface Props {
    onSubmit: (data: LoginFormData) => Promise<void>;
}

// ─── COMPONENT ──────────────────────────────────────────

export default function LoginForm({ onSubmit }: Props) {
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const handleFormSubmit = async (data: LoginFormData) => {
        setServerError('');
        try {
            await onSubmit(data);
        } catch (err: any) {
            const msg = err.response?.data?.message;
            setServerError(
                typeof msg === 'string' ? msg : 'Invalid email or password',
            );
        }
    };

    return (
        <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>

                {/* Header */}
                <Typography variant="h5" fontWeight={700} mb={0.5}>
                    Welcome back
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Sign in to your account
                </Typography>

                {/* Server error */}
                {serverError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {serverError}
                    </Alert>
                )}

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormTextField
                        label="Email"
                        type="email"
                        registration={register('email')}
                        error={errors.email?.message}
                        autoComplete="email"
                    />
                    <FormTextField
                        label="Password"
                        type="password"
                        registration={register('password')}
                        error={errors.password?.message}
                        autoComplete="current-password"
                    />
                    <LoadingButton loading={isSubmitting}>
                        Sign in
                    </LoadingButton>
                </Box>

                {/* Switch to register */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="body2" textAlign="center">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={{ color: '#6366f1', fontWeight: 600 }}
                    >
                        Register
                    </Link>
                </Typography>

            </CardContent>
        </Card>
    );
}