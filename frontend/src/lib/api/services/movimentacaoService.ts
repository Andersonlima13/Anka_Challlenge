// src/services/movementsService.ts
import { apiClient } from "../client/apiClient";


export interface Movement {
  id: number;
  client_id: number;
  client_name?: string; // backend pode trazer junto no ResponseDTO
  type: "entrada" | "saida";
  value: number;
  date: string;
  notes?: string;
}

export interface MovementCreate {
  client_id: number;
  type: "entrada" | "saida";
  value: number;
  date: string;
  notes?: string;
}

const movementService = {
  getAll: async (): Promise<Movement[]> => {
    const res = await apiClient.get("/movimentacoes/");
    return res.data;
  },
  getByClient: async (clientId: number): Promise<Movement[]> => {
    const res = await apiClient.get(`/movimentacoes/client/${clientId}`);
    return res.data;
  },
  create: async (data: MovementCreate): Promise<Movement> => {
    const res = await apiClient.post("/movimentacoes/", data);
    return res.data;
  },
  update: async (id: number, data: Partial<MovementCreate>): Promise<Movement> => {
    const res = await apiClient.put(`/movimentacoes/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/movimentacoes/${id}`);
  },
};

export default movementService;
