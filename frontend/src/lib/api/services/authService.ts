import { apiClient } from "../client/apiClient";

interface LoginResponse {
  access_token: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  // Login → salva token no localStorage e no cookie
  login: async (payload: LoginPayload): Promise<void> => {
    const res = await apiClient.post<LoginResponse>("/auth/login", payload);
    const { access_token } = res.data;

    // Salva no localStorage
    localStorage.setItem("token", access_token);

    // Salva também no cookie (para o middleware ter acesso)
    document.cookie = `token=${access_token}; path=/; SameSite=Lax;`;

    return;
  },

  // Logout → remove token do localStorage e do cookie
  logout: (): void => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/;";
  },

  // Pega token do localStorage (para usar no apiClient)
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  // Verifica se está autenticado
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },
};
