import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    Button,
    Alert,
    Divider,
} from '@mui/material';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { createProductApi, addVariantApi } from '../api/products';
import type { Variant } from '../types';
import FormTextField from '../components/ui/FormTextField';
import LoadingButton from '../components/ui/LoadingButton';
import AddVariantForm, {
    type VariantFormData,
} from '../components/products/AddVariantForm';
import VariantList from '../components/products/VariantList';
import PageWrapper from '../components/ui/PageWrapper';

// ─── SCHEMA ─────────────────────────────────────────────

const productSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    imageUrl: z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

// ─── STEPS ──────────────────────────────────────────────

const steps = ['Product details', 'Add variants', 'Done'];

// ─── COMPONENT ──────────────────────────────────────────

export default function CreateProductPage() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [productId, setProductId] = useState('');
    const [variants, setVariants] = useState<Variant[]>([]);
    const [duplicateError, setDuplicateError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
    });

    // ─── STEP 1: Create product ──────────────────────────

    const handleCreateProduct = async (data: ProductFormData) => {
        try {
            const { data: product } = await createProductApi({
                name: data.name,
                description: data.description || undefined,
                imageUrl: data.imageUrl || undefined,
            });
            setProductId(product.id);
            setActiveStep(1);
            toast.success('Product created! Now add variants.');
        } catch (err: any) {
            toast.error('Failed to create product. Try again.');
        }
    };

    // ─── STEP 2: Add variants ────────────────────────────

    const handleAddVariant = async (data: VariantFormData) => {
        setDuplicateError('');
        try {
            const { data: variant } = await addVariantApi(productId, {
                color: data.color,
                size: data.size,
                material: data.material,
                price: Number(data.price),
                stock: Number(data.stock),
            });
            setVariants((prev) => [...prev, variant]);
            toast.success(`Variant "${variant.combination_key}" added!`);
        } catch (err: any) {
            const msg = err.response?.data?.message;

            // Check if it's a duplicate error — show inline
            if (err.response?.status === 409) {
                setDuplicateError(
                    typeof msg === 'string'
                        ? msg
                        : 'This variant combination already exists.',
                );
            } else {
                toast.error('Failed to add variant.');
            }
        }
    };

    // ─── RENDER ─────────────────────────────────────────

    return (
        <PageWrapper showNavbar maxWidth={720}>

            {/* Back button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{ mb: 3, color: 'text.secondary' }}
            >
                Back to products
            </Button>

            <Typography variant="h4" fontWeight={700} mb={1}>
                Create Product
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
                Add a new product and its variants to the marketplace
            </Typography>

            {/* ── Stepper ── */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                <CardContent sx={{ p: 4 }}>

                    {/* ══ STEP 0: Product details ══ */}
                    {activeStep === 0 && (
                        <Box component="form" onSubmit={handleSubmit(handleCreateProduct)}>
                            <Typography variant="h6" fontWeight={600} mb={3}>
                                Product information
                            </Typography>

                            <FormTextField
                                label="Product name *"
                                registration={register('name')}
                                error={errors.name?.message}
                            />
                            <FormTextField
                                label="Description (optional)"
                                registration={register('description')}
                                error={errors.description?.message}
                            />
                            <FormTextField
                                label="Image URL (optional)"
                                registration={register('imageUrl')}
                                error={errors.imageUrl?.message}
                            />

                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <LoadingButton
                                    loading={isSubmitting}
                                    fullWidth={false}
                                >
                                    <Box display="flex" alignItems="center" gap={1}>
                                        Next — Add Variants
                                        <ArrowForward fontSize="small" />
                                    </Box>
                                </LoadingButton>
                            </Box>
                        </Box>
                    )}

                    {/* ══ STEP 1: Add variants ══ */}
                    {activeStep === 1 && (
                        <Box>
                            <Typography variant="h6" fontWeight={600} mb={1}>
                                Add variants
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Each variant is a unique combination of color, size and material.
                            </Typography>

                            {/* Duplicate error — shown inline */}
                            {duplicateError && (
                                <Alert
                                    severity="error"
                                    sx={{ mb: 2 }}
                                    onClose={() => setDuplicateError('')}
                                >
                                    {duplicateError}
                                </Alert>
                            )}

                            {/* Variant form */}
                            <AddVariantForm onSubmit={handleAddVariant} />

                            {/* Added variants table */}
                            <VariantList variants={variants} />

                            <Divider sx={{ my: 3 }} />

                            {/* Actions */}
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary" alignSelf="center">
                                    {variants.length === 0
                                        ? 'Add at least one variant'
                                        : `${variants.length} variant${variants.length !== 1 ? 's' : ''} added`}
                                </Typography>

                                <Button
                                    variant="contained"
                                    disabled={variants.length === 0}
                                    startIcon={<Check />}
                                    onClick={() => setActiveStep(2)}
                                >
                                    Finish
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* ══ STEP 2: Done ══ */}
                    {activeStep === 2 && (
                        <Box textAlign="center" py={4}>

                            {/* Success icon */}
                            <Box
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: '50%',
                                    background: '#f0fdf4',
                                    border: '2px solid #86efac',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px',
                                }}
                            >
                                <Check sx={{ fontSize: 36, color: '#16a34a' }} />
                            </Box>

                            <Typography variant="h5" fontWeight={700} mb={1}>
                                Product created!
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={4}>
                                Your product has been added with{' '}
                                <strong>{variants.length}</strong> variant
                                {variants.length !== 1 ? 's' : ''}.
                            </Typography>

                            {/* Variant summary */}
                            <VariantList variants={variants} />

                            <Box display="flex" gap={2} justifyContent="center" mt={4}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/products/${productId}`)}
                                >
                                    View product
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/')}
                                >
                                    Back to marketplace
                                </Button>
                            </Box>

                        </Box>
                    )}

                </CardContent>
            </Card>
        </PageWrapper>
    );
}