import {apiClient} from "@/lib/api/client/apiClient";

export interface User {
  id: number;
  email: string;
  is_active: boolean;
}

export interface UserCreateDTO {
  email: string;
  password: string;
  is_active?: boolean;
}

export interface UserUpdateDTO {
  email?: string;
  password?: string;
  is_active?: boolean;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const res = await apiClient.get<User[]>("/users");
    return res.data;
  },

  async getById(id: number): Promise<User> {
    const res = await apiClient.get<User>(`/users/${id}`);
    return res.data;
  },

  async create(data: UserCreateDTO): Promise<User> {
    const res = await apiClient.post<User>("/users", data);
    return res.data;
  },

  async update(id: number, data: UserUpdateDTO): Promise<User> {
    const res = await apiClient.put<User>(`/users/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<User> {
    const res = await apiClient.delete<User>(`/users/${id}`);
    return res.data;
  },
};
