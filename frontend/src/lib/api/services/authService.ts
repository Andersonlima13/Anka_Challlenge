import { apiClient } from "../client/apiClient";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  // 🔐 Login → salva token no localStorage e cookie
  login: async (payload: LoginPayload): Promise<void> => {
    const res = await apiClient.post<LoginResponse>("/auth/login", payload);
    const { access_token } = res.data;

    // Armazena token localmente
    localStorage.setItem("token", access_token);

    // Também salva no cookie (para o middleware ter acesso)
    document.cookie = `token=${access_token}; path=/; SameSite=Lax;`;

    return;
  },

  // 🚪 Logout → remove token
  logout: (): void => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/;";
  },

  // 📦 Recupera token (para uso no apiClient)
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  // 👤 Verifica se o usuário está autenticado
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },
};
