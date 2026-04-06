import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Divider,
    Button,
    Chip,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { quickBuyApi } from '../../api/products';
import type { Variant } from '../../types';
import LoadingButton from '../ui/LoadingButton';

interface Props {
    variant: Variant;
    productName: string;
    open: boolean;
    onClose: () => void;
    onSuccess: (remainingStock: number) => void;
}

export default function QuickBuyModal({
    variant,
    productName,
    open,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);

    const handleBuy = async () => {
        setLoading(true);
        try {
            const { data } = await quickBuyApi(variant.id);
            toast.success(`Purchased successfully! ${data.remainingStock} left in stock.`);
            onSuccess(data.remainingStock);
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.message;
            toast.error(
                typeof msg === 'string' ? msg : 'Purchase failed. Try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            {/* ── Header ── */}
            <DialogTitle sx={{ pb: 1 }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <ShoppingCart color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Quick Buy
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            {/* ── Content ── */}
            <DialogContent sx={{ pt: 2.5 }}>

                {/* Product name */}
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    Product
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                    {productName}
                </Typography>

                {/* Variant details */}
                <Typography variant="body2" color="text.secondary" mb={1}>
                    Selected variant
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Chip label={variant.color} size="small" variant="outlined" />
                    <Chip label={variant.size} size="small" variant="outlined" />
                    <Chip label={variant.material} size="small" variant="outlined" />
                </Box>

                {/* Price */}
                <Box
                    sx={{
                        background: '#f5f3ff',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Total price
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                        ${Number(variant.price).toFixed(2)}
                    </Typography>
                </Box>

                {/* Stock warning if low */}
                {variant.stock <= 3 && variant.stock > 0 && (
                    <Typography
                        variant="caption"
                        color="warning.main"
                        mt={1.5}
                        display="block"
                    >
                        Only {variant.stock} left — order soon!
                    </Typography>
                )}

            </DialogContent>

            <Divider />

            {/* ── Actions ── */}
            <DialogActions sx={{ p: 2.5, gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                    sx={{ flex: 1 }}
                >
                    Cancel
                </Button>
                <Box sx={{ flex: 1 }}>
                    <LoadingButton loading={loading} onClick={handleBuy} type="button">
                        Confirm Purchase
                    </LoadingButton>
                </Box>
            </DialogActions>

        </Dialog>
    );
}