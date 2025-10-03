import { apiClient } from "../client/apiClient";

export interface Asset {
  id: number;
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
}

export interface AssetCreate {
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
}

export interface AssetUpdate {
  ticker?: string;
  name?: string;
  exchange?: string;
  currency?: string;
}

export const assetService = {
  getAll: async (): Promise<Asset[]> => {
    const res = await apiClient.get("/assets/");
    return res.data;
  },
  create: async (data: AssetCreate): Promise<Asset> => {
    const res = await apiClient.post("/assets/create", data);
    return res.data;
  },
  fetchByTicker: async (ticker: string): Promise<Asset> => {
    const res = await apiClient.get(`/assets/fetch/${ticker}`);
    return res.data;
  },
  update: async (id: number, data: AssetUpdate): Promise<Asset> => {
    const res = await apiClient.put(`/assets/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/assets/${id}`);
  },
};
