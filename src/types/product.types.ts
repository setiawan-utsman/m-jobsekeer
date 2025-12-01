export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  unit: string;
  stockSystem: number;
  stockPhysical: number;
  minStock: number;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  lowStock?: boolean;
  sortBy?: 'latest' | 'oldest' | 'name' | 'price-asc' | 'price-desc';
  limit?: number;
  page?: number;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface CreateProductData {
  name: string;
  categoryId: string;
  unit: string;
  stockSystem: number;
  minStock: number;
  price: number;
  description?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}
