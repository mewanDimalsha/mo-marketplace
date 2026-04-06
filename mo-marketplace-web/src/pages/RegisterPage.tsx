import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../store/AuthContext';
import RegisterForm, { type RegisterFormData } from '../components/auth/RegisterForm';
import PageWrapper from '../components/ui/PageWrapper';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (data: RegisterFormData) => {
        // confirmPassword stripped automatically — only name/email/password sent
        await register(data.name, data.email, data.password);
        toast.success('Account created! Welcome!');
        navigate('/');
    };

    return (
        <PageWrapper centered>
            <RegisterForm onSubmit={handleSubmit} />
        </PageWrapper>
    );
}