import { api } from './api';
import { mockApi } from './mockApi';
import { API_CONFIG } from '@utils/constants';
import { Product, ProductWithCategory, Category, CreateProductData, UpdateProductData } from '@/types/product.types';

interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  lowStock?: boolean;
  sortBy?: 'latest' | 'oldest' | 'name' | 'price-asc' | 'price-desc';
  limit?: number;
  page?: number;
}

class ProductService {
  async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Product[]>('/products', { params });
    }
    return await api.get<Product[]>('/products', { params });
  }

  async getProductById(id: string): Promise<Product> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Product>(`/products/${id}`);
    }
    return await api.get<Product>(`/products/${id}`);
  }

  async getProductsWithCategory(params?: ProductQueryParams): Promise<ProductWithCategory[]> {
    if (API_CONFIG.MOCK_API) {
      const products = await mockApi.get<Product[]>('/products', { params });
      const categories = await mockApi.get<Category[]>('/categories');

      return products.map(product => ({
        ...product,
        category: categories.find(cat => cat.id === product.categoryId)
      }));
    }
    return await api.get<ProductWithCategory[]>('/products/with-category', { params });
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    if (API_CONFIG.MOCK_API) {
      // Mock API akan handle id, stockPhysical, timestamps
      return await mockApi.post<Product>('/products', data);
    }

    // Real API mungkin butuh data lengkap
    const newProduct = {
      ...data,
      id: Date.now().toString(),
      stockPhysical: data.stockSystem,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return await api.post<Product>('/products', newProduct);
  }

  async updateProduct(data: UpdateProductData): Promise<Product> {
    if (API_CONFIG.MOCK_API) {
      // Mock API akan handle updatedAt
      return await mockApi.put<Product>(`/products/${data.id}`, data);
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    return await api.put<Product>(`/products/${data.id}`, updateData);
  }

  async deleteProduct(id: string): Promise<void> {
    if (API_CONFIG.MOCK_API) {
      await mockApi.delete(`/products/${id}`);
      return;
    }
    await api.delete(`/products/${id}`);
  }

  async getCategories(): Promise<Category[]> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Category[]>('/categories');
    }
    return await api.get<Category[]>('/categories');
  }

  async getLowStockProducts(): Promise<Product[]> {
    if (API_CONFIG.MOCK_API) {
      // Gunakan filter lowStock dari mock API
      return await mockApi.get<Product[]>('/products', {
        params: { lowStock: true }
      });
    }

    const products = await this.getProducts();
    return products.filter(product => product.stockSystem <= product.minStock);
  }

  async searchProducts(query: string, params?: Omit<ProductQueryParams, 'search'>): Promise<Product[]> {
    if (API_CONFIG.MOCK_API) {
      // Gunakan filter search dari mock API
      return await mockApi.get<Product[]>('/products', {
        params: { ...params, search: query }
      });
    }

    const products = await this.getProducts();
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getProductsByCategory(categoryId: string, params?: Omit<ProductQueryParams, 'categoryId'>): Promise<Product[]> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Product[]>('/products', {
        params: { ...params, categoryId }
      });
    }
    return await api.get<Product[]>(`/products/category/${categoryId}`, { params });
  }

  async getProductsSorted(sortBy: ProductQueryParams['sortBy'], params?: Omit<ProductQueryParams, 'sortBy'>): Promise<Product[]> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Product[]>('/products', {
        params: { ...params, sortBy }
      });
    }
    return await api.get<Product[]>('/products', { params: { ...params, sortBy } });
  }

  async getProductsPaginated(page: number = 1, limit: number = 10, params?: Omit<ProductQueryParams, 'page' | 'limit'>): Promise<Product[]> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<Product[]>('/products', {
        params: { ...params, page, limit }
      });
    }
    return await api.get<Product[]>('/products', { params: { ...params, page, limit } });
  }
}

export const productService = new ProductService();