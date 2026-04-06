import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Paper,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import type { Variant } from '../../types';

interface Props {
    variants: Variant[];
}

export default function VariantList({ variants }: Props) {
    if (variants.length === 0) return null;

    return (
        <Box mt={3}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                    Added variants ({variants.length})
                </Typography>
            </Box>

            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ background: '#f9fafb' }}>
                            <TableCell><strong>Combination</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                            <TableCell><strong>Stock</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {variants.map((v) => (
                            <TableRow key={v.id} hover>
                                <TableCell>
                                    <Typography variant="body2" fontFamily="monospace">
                                        {v.combination_key}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        ${Number(v.price).toFixed(2)}
                                    </Typography>
                                </TableCell>
                                <TableCell>{v.stock}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={v.stock > 0 ? 'In stock' : 'Out of stock'}
                                        color={v.stock > 0 ? 'success' : 'error'}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}