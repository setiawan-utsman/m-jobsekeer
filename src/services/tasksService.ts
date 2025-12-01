import { api } from './api';
import { API_CONFIG } from '@/utils/constants';
import { mockApi } from './mockApi';

interface TasksQueryParams {
  search?: string;
  categoryId?: string;
}

export const TasksService = {
    // Task service methods would go here
//   getTasks: async (filters?: ReportFilters): Promise<Report[]> => {
//    if (API_CONFIG.MOCK_API) {
//          return await mockApi.get<Product[]>('/products', { params });
//        }
//        return await api.get<Product[]>('/products', { params });
//   },
  async getTasks(params?: TasksQueryParams): Promise<any[]> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<any[]>('/tasks', { params });
    }
    return await api.get<any[]>('/tasks', { params });
  },

  async createTask(data: any): Promise<any> {
      if (API_CONFIG.MOCK_API) {
        // Mock API akan handle id, stockPhysical, timestamps
        return await mockApi.post<any>('/tasks', data);
      }
  
      // Real API mungkin butuh data lengkap
      const newProduct = {
        ...data,
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
        return await api.post<any>('/tasks', newProduct);
      },
  
    async updateTask(data: any): Promise<any> {
        if (API_CONFIG.MOCK_API) {
          // Mock API akan handle updatedAt
          return await mockApi.put<any>(`/tasks/${data.id}`, data);
        }
    
        const updateData = {
          ...data,
          updatedAt: new Date().toISOString()
        };
        return await api.put<any>(`/tasks/${data.id}`, updateData);
      },

        async deleteTask(id: string): Promise<void> {
    if (API_CONFIG.MOCK_API) {
      await mockApi.delete(`/tasks/${id}`);
      return;
    }
    await api.delete(`/tasks/${id}`);
  }
}