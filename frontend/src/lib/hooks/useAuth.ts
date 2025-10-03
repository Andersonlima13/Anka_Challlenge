// src/lib/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../api/services/authService";

export function useAuth(redirectToLogin: boolean = true) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    setAuthenticated(isAuth);

    if (!isAuth && redirectToLogin) {
      router.push("/login");
    }
  }, [redirectToLogin, router]);

  return { authenticated };
}
