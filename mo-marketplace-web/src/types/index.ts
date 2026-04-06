export interface Variant {
    id: string;
    color: string;
    size: string;
    material: string;
    combination_key: string;
    price: number;
    stock: number;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: string;
    variants: Variant[];
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: AuthUser;
}