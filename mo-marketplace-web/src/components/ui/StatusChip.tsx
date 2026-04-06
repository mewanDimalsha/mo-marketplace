import { Chip } from '@mui/material';
import { Inventory } from '@mui/icons-material';

interface Props {
    inStock: boolean;
    size?: 'small' | 'medium';
    showIcon?: boolean;
}

export default function StatusChip({
    inStock,
    size = 'small',
    showIcon = false,
}: Props) {
    return (
        <Chip
            icon={showIcon ? <Inventory sx={{ fontSize: 14 }} /> : undefined}
            label={inStock ? 'In stock' : 'Out of stock'}
            color={inStock ? 'success' : 'error'}
            size={size}
            variant="outlined"
        />
    );
}