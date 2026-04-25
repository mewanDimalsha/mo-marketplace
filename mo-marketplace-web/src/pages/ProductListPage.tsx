import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { getProductsApi } from "../api/products";
import type { Product } from "../types";
import { useAuth } from "../store/useAuth";
import { useFetch } from "../hooks/useFetch";
import ProductCard from "../components/ui/ProductCard";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import PageWrapper from "../components/ui/PageWrapper";

export default function ProductListPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: products, loading } = useFetch<Product[]>(
    getProductsApi,
    "Failed to load products",
  );
  const [search, setSearch] = useState("");

  // Client side search filter
  const filtered = (products ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageWrapper showNavbar>
      {/* Header */}
      {/* <PageHeader
                title="Products"
                subtitle={`${products?.length ?? 0} products available`}
                action={
                    isAuthenticated
                        ? {
                            label: '+ New Product',
                            onClick: () => navigate('/create'),
                        }
                        : undefined
                }
            /> */}

      {/* Search */}
      <TextField
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4, width: "100%" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "#9ca3af" }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? "No products match your search" : "No products yet"}
          actionLabel={
            !search && isAuthenticated ? "Create first product" : undefined
          }
          onAction={
            !search && isAuthenticated ? () => navigate("/create") : undefined
          }
        />
      ) : (
        <Grid container spacing={3}>
          {filtered.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </PageWrapper>
  );
}
