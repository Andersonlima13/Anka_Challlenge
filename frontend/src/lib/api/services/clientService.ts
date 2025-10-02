import {apiClient } from "@/lib/api/client/apiClient";

// DTOs / Interface baseadas no backend (ClientResponseDTO, ClientCreateDTO, ClientUpdateDTO)
export interface Client {
  id: number;
  name: string;
  email: string;
  status: "ativo" | "inativo";
  createdAt: string;
}

export interface ClientCreateDTO {
  name: string;
  email: string;
  status: "ativo" | "inativo";
}

export interface ClientUpdateDTO {
  name?: string;
  email?: string;
  status?: "ativo" | "inativo";
  createdAt?: string;
}

export const clientService = {
  async getAll(): Promise<Client[]> {
    const res = await apiClient.get<Client[]>("/clients");
    return res.data;
  },

  async getById(id: number): Promise<Client> {
    const res = await apiClient.get<Client>(`/clients/${id}`);
    return res.data;
  },

  async create(data: ClientCreateDTO): Promise<Client> {
    const res = await apiClient.post<Client>("/clients/create", data);
    return res.data;
  },

  async update(id: number, data: ClientUpdateDTO): Promise<Client> {
    const res = await apiClient.put<Client>(`/clients/update/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<Client> {
    const res = await apiClient.delete<Client>(`/clients/delete/${id}`);
    return res.data;
  },
};
