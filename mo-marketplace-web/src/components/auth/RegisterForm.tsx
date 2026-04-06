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

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    },
);

export type RegisterFormData = z.infer<typeof registerSchema>;

// ─── PROPS ──────────────────────────────────────────────

interface Props {
    onSubmit: (data: RegisterFormData) => Promise<void>;
}

// ─── COMPONENT ──────────────────────────────────────────

export default function RegisterForm({ onSubmit }: Props) {
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const handleFormSubmit = async (data: RegisterFormData) => {
        setServerError('');
        try {
            await onSubmit(data);
        } catch (err: any) {
            const msg = err.response?.data?.message;
            setServerError(
                typeof msg === 'string'
                    ? msg
                    : 'Registration failed. Try again.',
            );
        }
    };

    return (
        <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>

                {/* Header */}
                <Typography variant="h5" fontWeight={700} mb={0.5}>
                    Create account
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Join MO Marketplace today
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
                        label="Full name"
                        registration={register('name')}
                        error={errors.name?.message}
                        autoComplete="name"
                    />
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
                        autoComplete="new-password"
                    />
                    <FormTextField
                        label="Confirm password"
                        type="password"
                        registration={register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                        autoComplete="new-password"
                    />
                    <LoadingButton loading={isSubmitting}>
                        Create account
                    </LoadingButton>
                </Box>

                {/* Switch to login */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="body2" textAlign="center">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{ color: '#6366f1', fontWeight: 600 }}
                    >
                        Sign in
                    </Link>
                </Typography>

            </CardContent>
        </Card>
    );
}