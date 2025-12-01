import { Category } from '@/types/product.types';
import * as db from 'server/db.json';

let categories: Category[] = [...db.categories];

export async function get<T = any>(url: string, config?: any): Promise<T> {
    if (url === '/categories') {
        return categories as unknown as T;
    }

    // Get single category
    const match = url.match(/\/categories\/(\w+)/);
    if (match) {
        const category = categories.find(c => c.id === match[1]);
        if (!category) throw new Error('Category not found');
        return category as unknown as T;
    }

    throw new Error(`Unknown GET /categories endpoint: ${url}`);
}

export async function post<T = any>(url: string, body?: Partial<Category>): Promise<T> {
    if (url === '/categories') {
        if (!body) throw new Error('Category data is required');

        const newCategory: Category = {
            id: String(Date.now()),
            name: body.name || '',
            slug: body.slug || body.name?.toLowerCase().replace(/\s+/g, '-') || '',
            description: body.description || '',
            icon: body.icon || '📦',
            color: body.color || '#6366f1',
        };

        categories.push(newCategory);
        return newCategory as unknown as T;
    }

    throw new Error(`Unknown POST /categories endpoint: ${url}`);
}

export async function put<T = any>(url: string, body: Partial<Category>): Promise<T> {
    const match = url.match(/\/categories\/(\w+)/);
    if (match) {
        const id = match[1];
        const index = categories.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Category not found');

        categories[index] = {
            ...categories[index],
            ...body
        };

        return categories[index] as unknown as T;
    }

    throw new Error(`Unknown PUT /categories endpoint: ${url}`);
}

export async function del<T = any>(url: string): Promise<T> {
    const match = url.match(/\/categories\/(\w+)/);
    if (match) {
        const id = match[1];
        const initialLength = categories.length;
        categories = categories.filter(c => c.id !== id);

        if (categories.length === initialLength) {
            throw new Error('Category not found');
        }

        return { message: 'Category deleted successfully' } as unknown as T;
    }

    throw new Error(`Unknown DELETE /categories endpoint: ${url}`);
}