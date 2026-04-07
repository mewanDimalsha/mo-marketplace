import { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { CloudUpload, Image } from '@mui/icons-material';
import { uploadImageApi } from '../../api/products';

interface Props {
    onUpload: (url: string) => void;
    currentUrl?: string;
}

export default function ImageUpload({ onUpload, currentUrl }: Props) {
    const [preview, setPreview] = useState(currentUrl || '');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size on frontend too
        if (file.size > 5 * 1024 * 1024) {
            setError('File must be smaller than 5MB');
            return;
        }

        // Show instant local preview
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);
        setError('');
        setUploading(true);

        try {
            const { data } = await uploadImageApi(file);
            onUpload(data.url);       // pass cloudinary URL to parent
            setPreview(data.url);     // replace local blob with real URL
        } catch {
            setError('Upload failed. Try again.');
            setPreview(currentUrl || '');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box mb={2}>
            <Typography variant="body2" fontWeight={600} mb={1}>
                Product image
            </Typography>

            {/* Preview */}
            {preview ? (
                <Box position="relative" mb={1}>
                    <Box
                        component="img"
                        src={preview}
                        alt="Product preview"
                        sx={{
                            width: '100%',
                            height: 220,
                            objectFit: 'cover',
                            borderRadius: 2,
                            border: '1px solid #e5e7eb',
                            display: 'block',
                        }}
                    />
                    {uploading && (
                        <Box
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                inset: 0,
                                background: 'rgba(255,255,255,0.7)',
                                borderRadius: 2,
                            }}
                        >
                            <CircularProgress size={32} />
                        </Box>
                    )}
                </Box>
            ) : (
                // Empty upload zone
                <Box
                    onClick={() => inputRef.current?.click()}
                    sx={{
                        border: '2px dashed #d1d5db',
                        borderRadius: 2,
                        height: 160,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        mb: 1,
                        transition: 'border-color 0.2s',
                        '&:hover': { borderColor: 'primary.main' },
                    }}
                >
                    <Image sx={{ fontSize: 40, color: '#9ca3af' }} />
                    <Typography variant="body2" color="text.secondary">
                        Click to upload image
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        JPG, PNG, WEBP up to 5MB
                    </Typography>
                </Box>
            )}

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    {error}
                </Alert>
            )}

            {/* Button */}
            <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                fullWidth
                size="small"
            >
                {uploading
                    ? 'Uploading...'
                    : preview
                        ? 'Change image'
                        : 'Upload from device'}
            </Button>

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
            />
        </Box>
    );
}