import { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Box,
    Button,
    TextField,
    InputAdornment,
} from '@mui/material';
import { Search, SentimentDissatisfied } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProductsApi } from '../api/products';
import type { Product } from '../types';
import { useAuth } from '../store/AuthContext';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import PageWrapper from '../components/ui/PageWrapper';

export default function ProductListPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // ─── FETCH ──────────────────────────────────────────

    useEffect(() => {
        getProductsApi()
            .then((res) => {
                setProducts(res.data);
                setFiltered(res.data);
            })
            .catch(() => toast.error('Failed to load products'))
            .finally(() => setLoading(false));
    }, []);

    // ─── SEARCH ─────────────────────────────────────────

    useEffect(() => {
        const query = search.toLowerCase();
        setFiltered(
            products.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query),
            ),
        );
    }, [search, products]);

    // ─── RENDER ─────────────────────────────────────────

    return (
        <PageWrapper showNavbar>

            {/* ── Header ── */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
                flexWrap="wrap"
                gap={2}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Products
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {products.length} product{products.length !== 1 ? 's' : ''} available
                    </Typography>
                </Box>

                {isAuthenticated && (
                    <Button
                        variant="contained"
                        onClick={() => navigate('/create')}
                    >
                        + New Product
                    </Button>
                )}
            </Box>

            {/* ── Search ── */}
            <TextField
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 4, maxWidth: 400 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: '#9ca3af' }} />
                        </InputAdornment>
                    ),
                }}
            />

            {/* ── Grid ── */}
            {loading ? (
                // Skeleton loaders while fetching
                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Grid xs={12} sm={6} md={4} key={i}>
                            <ProductCardSkeleton />
                        </Grid>
                    ))}
                </Grid>
            ) : filtered.length === 0 ? (
                // Empty state
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={10}
                    color="text.secondary"
                >
                    <SentimentDissatisfied sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" mb={1}>
                        {search ? 'No products match your search' : 'No products yet'}
                    </Typography>
                    {!search && isAuthenticated && (
                        <Button
                            variant="contained"
                            onClick={() => navigate('/create')}
                            sx={{ mt: 2 }}
                        >
                            Create first product
                        </Button>
                    )}
                </Box>
            ) : (
                // Product grid
                <Grid container spacing={3}>
                    {filtered.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            )}

        </PageWrapper>
    );
}