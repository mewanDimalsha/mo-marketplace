import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ─── REQUEST INTERCEPTOR ────────────────────────────────
// Attaches access token to every request automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── RESPONSE INTERCEPTOR ───────────────────────────────
// Catches 401 errors and silently refreshes the token
client.interceptors.response.use(
  (response) => response, // success → pass through untouched

  async (error) => {
    const originalRequest = error.config;

    // If 401 AND we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // mark so we don't retry infinitely

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        // Call refresh endpoint with current refresh token in body
        //using client here would trigger the request interceptor again, which would attach the expired token.
        // Using raw axios bypasses your interceptor. manually attach the token instead.
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        // Store new tokens
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return client(originalRequest);
      } catch {
        // Refresh failed → clear everything → force login
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default client;
