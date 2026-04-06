import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import type React from 'react';

interface Props {
    children: React.ReactNode
}

export default function PrivateRoute({ children }: Props) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}