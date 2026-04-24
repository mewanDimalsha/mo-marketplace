import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./store/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CreateProductPage from "./pages/CreateProductPage";

export default function App() {
  return (
    <AuthProvider>
      {" "}
      //gives everyone access to auth state
      <BrowserRouter>
        <Toaster //single <Toaster> component rendered once anywhere in the tree — it's the container that actually displays toast notifications.
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "8px", fontFamily: "inherit" },
          }}
        />
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                {" "}
                //reads auth state and either renders children or redirects to
                login
                <CreateProductPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
