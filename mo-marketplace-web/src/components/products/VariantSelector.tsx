import { Box, Typography, Chip, Divider } from '@mui/material';
import type { Variant } from '../../types';

interface Props {
    variants: Variant[];
    selected: Variant | null;
    onSelect: (variant: Variant) => void;
}

// ─── HELPER ─────────────────────────────────────────────

// Group variants by attribute for organized display
function getUniqueValues(variants: Variant[], key: keyof Variant) {
    return [...new Set(variants.map((v) => String(v[key])))];
}

// ─── COMPONENT ──────────────────────────────────────────

export default function VariantSelector({
    variants,
    selected,
    onSelect,
}: Props) {
    if (variants.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                No variants available for this product.
            </Typography>
        );
    }

    const colors = getUniqueValues(variants, 'color');
    const sizes = getUniqueValues(variants, 'size');
    const materials = getUniqueValues(variants, 'material');

    // Find variant matching current selections
    const findVariant = (color: string, size: string, material: string) =>
        variants.find(
            (v) =>
                v.color === color &&
                v.size === size &&
                v.material === material,
        ) || null;

    // Check if a specific value is available given current selection
    const isColorAvailable = (color: string) =>
        variants.some((v) => v.color === color && v.stock > 0);

    const isSizeAvailable = (size: string) =>
        variants.some(
            (v) =>
                v.size === size &&
                (!selected || v.color === selected.color) &&
                v.stock > 0,
        );

    const isMaterialAvailable = (material: string) =>
        variants.some(
            (v) =>
                v.material === material &&
                (!selected || v.color === selected.color) &&
                (!selected || v.size === selected.size) &&
                v.stock > 0,
        );

    const handleSelect = (
        type: 'color' | 'size' | 'material',
        value: string,
    ) => {
        const current = {
            color: selected?.color || colors[0],
            size: selected?.size || sizes[0],
            material: selected?.material || materials[0],
            [type]: value,
        };
        const match = findVariant(current.color, current.size, current.material);
        if (match) onSelect(match);
    };

    // ─── RENDER ───────────────────────────────────────────

    return (
        <Box>

            {/* ── Color ── */}
            <Box mb={2.5}>
                <Typography variant="body2" fontWeight={600} mb={1}>
                    Color
                    {selected && (
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            ml={1}
                        >
                            — {selected.color}
                        </Typography>
                    )}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {colors.map((color) => {
                        const available = isColorAvailable(color);
                        const isSelected = selected?.color === color;
                        return (
                            <Chip
                                key={color}
                                label={color}
                                onClick={() => available && handleSelect('color', color)}
                                variant={isSelected ? 'filled' : 'outlined'}
                                color={isSelected ? 'primary' : 'default'}
                                disabled={!available}
                                sx={{
                                    textDecoration: !available ? 'line-through' : 'none',
                                    cursor: available ? 'pointer' : 'not-allowed',
                                    fontWeight: isSelected ? 600 : 400,
                                    opacity: !available ? 0.5 : 1,
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {/* ── Size ── */}
            <Box mb={2.5}>
                <Typography variant="body2" fontWeight={600} mb={1}>
                    Size
                    {selected && (
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            ml={1}
                        >
                            — {selected.size}
                        </Typography>
                    )}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {sizes.map((size) => {
                        const available = isSizeAvailable(size);
                        const isSelected = selected?.size === size;
                        return (
                            <Chip
                                key={size}
                                label={size}
                                onClick={() => available && handleSelect('size', size)}
                                variant={isSelected ? 'filled' : 'outlined'}
                                color={isSelected ? 'primary' : 'default'}
                                disabled={!available}
                                sx={{
                                    textDecoration: !available ? 'line-through' : 'none',
                                    cursor: available ? 'pointer' : 'not-allowed',
                                    fontWeight: isSelected ? 600 : 400,
                                    opacity: !available ? 0.5 : 1,
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {/* ── Material ── */}
            <Box mb={2.5}>
                <Typography variant="body2" fontWeight={600} mb={1}>
                    Material
                    {selected && (
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            ml={1}
                        >
                            — {selected.material}
                        </Typography>
                    )}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {materials.map((material) => {
                        const available = isMaterialAvailable(material);
                        const isSelected = selected?.material === material;
                        return (
                            <Chip
                                key={material}
                                label={material}
                                onClick={() =>
                                    available && handleSelect('material', material)
                                }
                                variant={isSelected ? 'filled' : 'outlined'}
                                color={isSelected ? 'primary' : 'default'}
                                disabled={!available}
                                sx={{
                                    textDecoration: !available ? 'line-through' : 'none',
                                    cursor: available ? 'pointer' : 'not-allowed',
                                    fontWeight: isSelected ? 600 : 400,
                                    opacity: !available ? 0.5 : 1,
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {/* ── Selected variant summary ── */}
            {selected && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Box
                        sx={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: 2,
                            p: 2,
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="body2" color="text.secondary">
                                Selected
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {selected.combination_key}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                                Stock
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color={selected.stock > 0 ? 'success.main' : 'error.main'}
                            >
                                {selected.stock > 0
                                    ? `${selected.stock} left`
                                    : 'Out of stock'}
                            </Typography>
                        </Box>
                    </Box>
                </>
            )}

        </Box>
    );
}