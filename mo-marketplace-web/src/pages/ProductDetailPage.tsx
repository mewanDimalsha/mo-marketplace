import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Typography, Box, Button, Skeleton, Alert } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import toast from "react-hot-toast";
import { getProductApi } from "../api/products";
import type { Product, Variant } from "../types";
import VariantSelector from "../components/products/VariantSelector";
import QuickBuyModal from "../components/products/QuickBuyModal";
import PageWrapper from "../components/ui/PageWrapper";
import StatusChip from "../components/ui/StatusChip";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../store/useAuth";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Variant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ─── FETCH ────────────────────────────────────────────

  const loadProduct = () => {
    if (!id) return;
    setLoading(true);
    getProductApi(id)
      .then((res) => setProduct(res.data))
      .catch(() => {
        toast.error("Product not found");
        navigate("/");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  // ─── QUICK BUY SUCCESS ────────────────────────────────

  const handleBuySuccess = (remainingStock: number) => {
    if (!product || !selected) return;

    const updatedVariants = product.variants.map((v) =>
      v.id === selected.id ? { ...v, stock: remainingStock } : v,
    );

    setProduct({ ...product, variants: updatedVariants });
    setSelected({ ...selected, stock: remainingStock });
  };

  // ─── LOADING STATE ────────────────────────────────────

  if (loading) {
    return (
      <PageWrapper showNavbar>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 3 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton variant="text" width="60%" height={48} />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
            <Box mt={3}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
      </PageWrapper>
    );
  }

  if (!product) return null;

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const inStock = totalStock > 0;

  // ─── RENDER ───────────────────────────────────────────

  return (
    <PageWrapper showNavbar>
      {/* ── Back button via PageHeader ── */}
      <PageHeader title="" backTo="/" />

      <Grid container spacing={4}>
        {/* ── Left: Image ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            component="img"
            src={
              product.imageUrl ||
              `https://picsum.photos/seed/${product.id}/600/600`
            }
            alt={product.name}
            sx={{
              width: "100%",
              height: 400,
              objectFit: "cover",
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}
          />
        </Grid>

        {/* ── Right: Details ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Name + stock status */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            mb={1}
            flexWrap="wrap"
          >
            <Typography variant="h4" fontWeight={700}>
              {product.name}
            </Typography>
            <StatusChip inStock={inStock} showIcon />
          </Box>

          {/* Description */}
          <Typography variant="body1" color="text.secondary" mb={3}>
            {product.description || "No description provided."}
          </Typography>

          {/* Selected variant price */}
          {selected && (
            <Typography
              variant="h4"
              fontWeight={700}
              color="primary.main"
              mb={3}
            >
              ${Number(selected.price).toFixed(2)}
            </Typography>
          )}

          {/* Variant selector */}
          <Box mb={3}>
            <VariantSelector
              variants={product.variants}
              selected={selected}
              onSelect={setSelected}
            />
          </Box>

          {/* Action button — 3 states */}
          {!selected ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Select a variant above to continue
            </Alert>
          ) : selected.stock === 0 ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              This variant is out of stock
            </Alert>
          ) : !isAuthenticated ? (
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate("/login")}
              sx={{ py: 1.5, fontSize: 16 }}
            >
              Login to Purchase
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={() => setModalOpen(true)}
              sx={{ py: 1.5, fontSize: 16 }}
            >
              Quick Buy — ${Number(selected.price).toFixed(2)}
            </Button>
          )}
        </Grid>
      </Grid>

      {/* ── Quick Buy Modal ── */}
      {selected && (
        <QuickBuyModal
          open={modalOpen}
          variant={selected}
          productName={product.name}
          onClose={() => setModalOpen(false)}
          onSuccess={handleBuySuccess}
        />
      )}
    </PageWrapper>
  );
}
