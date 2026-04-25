import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../store/useAuth";
import LoginForm, { type LoginFormData } from "../components/auth/LoginForm";
import PageWrapper from "../components/ui/PageWrapper";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    }
  };

  return (
    <PageWrapper centered>
      <LoginForm onSubmit={handleSubmit} />
    </PageWrapper>
  );
}
