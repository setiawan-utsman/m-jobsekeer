import { api } from './api';
// import { mockApi } from './mockApi';
import { API_CONFIG } from '@utils/constants';
import {
    UserData,
    CreateUserInput,
    UpdateUserInput,
    UserFilters
} from '@/types/user.types';
import { mockApi } from './mockApi';

class UserService {
    async getAll(filters?: UserFilters): Promise<UserData[]> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.get<UserData[]>('/users', { params: filters });
        }
        return await api.get<UserData[]>('/users', { params: filters });
    }

    async getById(id: string): Promise<UserData> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.get<UserData>(`/users/${id}`);
        }
        return await api.get<UserData>(`/users/${id}`);
    }

    async create(data: CreateUserInput): Promise<UserData> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.post<UserData>('/users', data);
        }
        return await api.post<UserData>('/users', data);
    }

    async update(data: UpdateUserInput): Promise<UserData> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.put<UserData>(`/users/${data.id}`, data);
        }
        return await api.put<UserData>(`/users/${data.id}`, data);
    }

    async delete(id: string): Promise<{ message: string }> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.delete<{ message: string }>(`/users/${id}`);
        }
        return await api.delete<{ message: string }>(`/users/${id}`);
    }
}

export const userService = new UserService();
