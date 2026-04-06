import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Typography,
    Chip,
    Box,
} from '@mui/material';
import type { Product } from '../../types';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const navigate = useNavigate();

    const totalStock = product.variants.reduce(
        (sum, v) => sum + v.stock, 0
    );
    const inStock = totalStock > 0;
    const variantCount = product.variants.length;
    const lowestPrice = product.variants.length > 0
        ? Math.min(...product.variants.map((v) => Number(v.price)))
        : null;

    return (
        <Card
            sx={{
                borderRadius: 3,
                border: '1px solid #e5e7eb',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <CardActionArea onClick={() => navigate(`/products/${product.id}`)}>

                {/* Product Image */}
                <CardMedia
                    component="img"
                    height={200}
                    image={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/200`}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                />

                <CardContent>
                    {/* Name */}
                    <Typography variant="h6" fontWeight={600} mb={0.5} noWrap>
                        {product.name}
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={1.5}
                        sx={{
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {product.description || 'No description provided'}
                    </Typography>

                    {/* Bottom row */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" gap={1} alignItems="center">
                            {/* Stock status */}
                            <Chip
                                label={inStock ? 'In stock' : 'Out of stock'}
                                size="small"
                                color={inStock ? 'success' : 'error'}
                                variant="outlined"
                            />
                            {/* Variant count */}
                            <Typography variant="caption" color="text.secondary">
                                {variantCount} variant{variantCount !== 1 ? 's' : ''}
                            </Typography>
                        </Box>

                        {/* Price */}
                        {lowestPrice !== null && (
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                color="primary.main"
                            >
                                from ${lowestPrice}
                            </Typography>
                        )}
                    </Box>

                </CardContent>
            </CardActionArea>
        </Card>
    );
}