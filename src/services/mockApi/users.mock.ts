import { User } from '@/types/auth.types';
import { CreateUserInput, UpdateUserInput, UserFilters } from '@/types/user.types';
import * as db from 'server/db.json';

let users: User[] = [...db.users];

export async function get<T = any>(url: string, config?: { params?: UserFilters }): Promise<T> {
    if (url === '/users') {
        const { params } = config || {};
        let filtered = [...users];

        if (params) {
            const { search, role, status, sortBy, limit = 10, page = 1 } = params;
            if (search) {
                const q = search.toLowerCase();
                filtered = filtered.filter(
                    u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
                );
            }
            if (role) filtered = filtered.filter(u => u.role === role);
            if (status) filtered = filtered.filter(u => u.status === status);

            if (sortBy === 'latest') filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
            else if (sortBy === 'oldest') filtered.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
            else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

            const start = (page - 1) * limit;
            return filtered.slice(start, start + limit) as unknown as T;
        }

        return users as unknown as T;
    }

    const match = url.match(/\/users\/(\w+)/);
    if (match) {
        const user = users.find(u => u.id === match[1]);
        if (!user) throw new Error('User not found');
        return user as unknown as T;
    }

    throw new Error(`Unknown GET /users endpoint: ${url}`);
}

export async function post<T = any>(url: string, body?: CreateUserInput): Promise<T> {
    if (url === '/users') {
        const newUser: User = {
            id: String(Date.now()),
            email: body!.email,
            password: body!.password,
            name: body!.name,
            role: body!.role || 'user',
            status: body!.status || 'active',
            avatar: body!.avatar || `https://i.pravatar.cc/150?u=${body!.email}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        users.push(newUser);
        return newUser as unknown as T;
    }
    throw new Error(`Unknown POST /users endpoint: ${url}`);
}

export async function put<T = any>(url: string, body: UpdateUserInput): Promise<T> {
    const match = url.match(/\/users\/(\w+)/);
    if (match) {
        const id = match[1];
        const index = users.findIndex(u => u.id === id);
        if (index === -1) throw new Error('User not found');
        users[index] = { ...users[index], ...body, updatedAt: new Date().toISOString() };
        return users[index] as unknown as T;
    }
    throw new Error(`Unknown PUT /users endpoint: ${url}`);
}

export async function del<T = any>(url: string): Promise<T> {
    const match = url.match(/\/users\/(\w+)/);
    if (match) {
        const id = match[1];
        users = users.filter(u => u.id !== id);
        return { message: 'User deleted successfully' } as unknown as T;
    }
    throw new Error(`Unknown DELETE /users endpoint: ${url}`);
}
