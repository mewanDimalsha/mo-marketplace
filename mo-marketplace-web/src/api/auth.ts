import client from './client';
import type { AuthResponse } from '../types';

export const registerApi = (data: {
    name: string;
    email: string;
    password: string;
}) => client.post<AuthResponse>('/auth/register', data);

export const loginApi = (data: {
    email: string;
    password: string;
}) => client.post<AuthResponse>('/auth/login', data);

export const logoutApi = () =>
    client.post('/auth/logout');