// src/lib/api/services/movimentacaoService.ts
import { apiClient } from "../client/apiClient";

export interface Movement {
  id: number;
  client_id: number;
  client_name?: string;
  type: "deposit" | "withdraw"; // backend usa esses termos
  amount: number;
  date: string;
  note?: string;
}

export interface MovementCreate {
  client_id: number;
  type: "entrada" | "saida"; // frontend usa esses
  value: number;
  date: string;
  notes?: string;
}

const movementService = {
  getAll: async (): Promise<Movement[]> => {
    const res = await apiClient.get("/movimentacoes/");
    return res.data;
  },

  create: async (data: MovementCreate): Promise<Movement> => {
    if (!data.client_id) {
      throw new Error("Cliente não selecionado — selecione um cliente antes de salvar.");
    }

    // 🔁 Converte o formato do front para o formato esperado pelo backend
    const payload = {
      client_id: data.client_id,
      type: data.type === "entrada" ? "deposit" : "withdraw",
      amount: data.value,
      date: data.date,
      note: data.notes || "",
    };

    const res = await apiClient.post("/movimentacoes/", payload);
    return res.data;
  },

  update: async (id: number, data: Partial<MovementCreate>): Promise<Movement> => {
    const payload = {
      ...(data.type && { type: data.type === "entrada" ? "deposit" : "withdraw" }),
      ...(data.value && { amount: data.value }),
      ...(data.date && { date: data.date }),
      ...(data.notes && { note: data.notes }),
    };
    const res = await apiClient.put(`/movimentacoes/${id}`, payload);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/movimentacoes/${id}`);
  },
};

export default movementService;
