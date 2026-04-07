import client from './client';
import type { Product, Variant } from '../types';

export const getProductsApi = () =>
    client.get<Product[]>('/products');

export const getProductApi = (id: string) =>
    client.get<Product>(`/products/${id}`);

export const createProductApi = (data: {
    name: string;
    description?: string;
    imageUrl?: string;
}) => client.post<Product>('/products', data);

export const addVariantApi = (
    productId: string,
    data: {
        color: string;
        size: string;
        material: string;
        price: number;
        stock: number;
    },
) => client.post<Variant>(`/products/${productId}/variants`, data);

export const quickBuyApi = (variantId: string) =>
    client.post<{ message: string; remainingStock: number }>(
        `/products/variants/${variantId}/quick-buy`,
    );

export const uploadImageApi = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post<{ url: string }>('/uploads/image', formData);
};