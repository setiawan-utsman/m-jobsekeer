// products.mock.ts
import { CreateProductData, Product, ProductFilters, UpdateProductData } from '@/types/product.types';
import * as db from 'server/db.json';

let products: Product[] = [...db.products];

export async function get<T = any>(url: string, config?: { params?: ProductFilters }): Promise<T> {
  if (url === '/products') {
    const { params } = config || {};
    let filtered = [...products];

    if (params) {
      const { search, categoryId, lowStock, sortBy, limit = 10, page = 1 } = params;
      
      // Filter by search
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          p => p.name.toLowerCase().includes(q) || 
               p.description?.toLowerCase().includes(q)
        );
      }
      
      // Filter by category
      if (categoryId) {
        filtered = filtered.filter(p => p.categoryId === categoryId);
      }
      
      // Filter by low stock
      if (lowStock) {
        filtered = filtered.filter(p => p.stockSystem <= p.minStock);
      }

      // Sort
      if (sortBy === 'latest') {
        filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      } else if (sortBy === 'oldest') {
        filtered.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
      } else if (sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      }

      // Pagination
      const start = (page - 1) * limit;
      return filtered.slice(start, start + limit) as unknown as T;
    }

    return products as unknown as T;
  }

  // Get single product
  const match = url.match(/\/products\/(\w+)/);
  if (match) {
    const product = products.find(p => p.id === match[1]);
    if (!product) throw new Error('Product not found');
    return product as unknown as T;
  }

  throw new Error(`Unknown GET /products endpoint: ${url}`);
}

export async function post<T = any>(url: string, body?: CreateProductData): Promise<T> {
  if (url === '/products') {
    if (!body) throw new Error('Product data is required');
    
    const newProduct: Product = {
      id: String(Date.now()),
      name: body.name,
      categoryId: body.categoryId,
      unit: body.unit,
      stockSystem: body.stockSystem,
      stockPhysical: body.stockSystem, // Initial physical stock same as system
      minStock: body.minStock,
      price: body.price,
      description: body.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    return newProduct as unknown as T;
  }
  
  throw new Error(`Unknown POST /products endpoint: ${url}`);
}

export async function put<T = any>(url: string, body: UpdateProductData): Promise<T> {
  const match = url.match(/\/products\/(\w+)/);
  if (match) {
    const id = match[1];
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    products[index] = { 
      ...products[index], 
      ...body, 
      updatedAt: new Date().toISOString() 
    };
    
    return products[index] as unknown as T;
  }
  
  throw new Error(`Unknown PUT /products endpoint: ${url}`);
}

export async function del<T = any>(url: string): Promise<T> {
  const match = url.match(/\/products\/(\w+)/);
  if (match) {
    const id = match[1];
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    
    if (products.length === initialLength) {
      throw new Error('Product not found');
    }
    
    return { message: 'Product deleted successfully' } as unknown as T;
  }
  
  throw new Error(`Unknown DELETE /products endpoint: ${url}`);
}