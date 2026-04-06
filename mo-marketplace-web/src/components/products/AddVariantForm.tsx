import { Box, Typography, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormTextField from '../ui/FormTextField';
import LoadingButton from '../ui/LoadingButton';

// ─── SCHEMA ─────────────────────────────────────────────

const variantSchema = z.object({
    color: z.string().min(1, 'Color is required'),
    size: z.string().min(1, 'Size is required'),
    material: z.string().min(1, 'Material is required'),
    price: z
        .string()
        .min(1, 'Price is required')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Price must be greater than 0',
        }),
    stock: z
        .string()
        .min(1, 'Stock is required')
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: 'Stock cannot be negative',
        }),
});

export type VariantFormData = z.infer<typeof variantSchema>;

// ─── PROPS ──────────────────────────────────────────────

interface Props {
    onSubmit: (data: VariantFormData) => Promise<void>;
}

// ─── COMPONENT ──────────────────────────────────────────

export default function AddVariantForm({ onSubmit }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<VariantFormData>({
        resolver: zodResolver(variantSchema),
    });

    const handleFormSubmit = async (data: VariantFormData) => {
        await onSubmit(data);
        reset(); // clear form after successful add
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Variant details
            </Typography>

            {/* Color / Size / Material */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FormTextField
                        label="Color"
                        registration={register('color')}
                        error={errors.color?.message}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FormTextField
                        label="Size"
                        registration={register('size')}
                        error={errors.size?.message}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FormTextField
                        label="Material"
                        registration={register('material')}
                        error={errors.material?.message}
                    />
                </Grid>
            </Grid>

            {/* Price / Stock */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormTextField
                        label="Price ($)"
                        type="number"
                        registration={register('price')}
                        error={errors.price?.message}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormTextField
                        label="Stock quantity"
                        type="number"
                        registration={register('stock')}
                        error={errors.stock?.message}
                    />
                </Grid>
            </Grid>

            <LoadingButton loading={isSubmitting}>
                + Add Variant
            </LoadingButton>
        </Box>
    );
}