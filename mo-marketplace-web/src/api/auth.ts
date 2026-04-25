import client from "./client";
import type { AuthResponse } from "../types";

export const registerApi = (data: {
  name: string;
  email: string;
  password: string;
}) => client.post<AuthResponse>("/auth/register", data);

export const loginApi = (data: { email: string; password: string }) =>
  client.post<AuthResponse>("/auth/login", data);

export const logoutApi = () =>
  // no body needed, token sent in header by interceptor
  client.post("/auth/logout");
