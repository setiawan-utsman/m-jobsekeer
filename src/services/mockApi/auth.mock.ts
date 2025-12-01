import { User, AuthResponse } from '@/types/auth.types';
import * as db from 'server/db.json';

let users: User[] = [...db.users];
let currentToken: string | null = null;

function fakeTokenFor(user: User) {
    const token = btoa(`${user.id}:${user.email}:${Date.now()}`);
    currentToken = token;
    return token;
}

export async function post<T = any>(url: string, body?: any): Promise<T> {
    // LOGIN
    if (url === '/auth/login') {
        const { email, password } = body ?? {};
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) throw new Error('Invalid credentials');

        const { password: _p, ...safeUser } = found;
        const response: AuthResponse = { token: fakeTokenFor(found), user: safeUser };
        return response as unknown as T;
    }

    // REGISTER
    if (url === '/auth/register') {
        const { email, password, name } = body ?? {};
        if (users.some(u => u.email === email)) throw new Error('Email already exists');

        const newUser: User = {
            id: String(users.length + 1),
            email,
            name,
            password,
            role: 'user',
            status: 'active',
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        users.push(newUser);

        const { password: _p, ...safeUser } = newUser;
        const response: AuthResponse = { token: fakeTokenFor(newUser), user: safeUser };
        return response as unknown as T;
    }

    // LOGOUT
    if (url === '/auth/logout') {
        currentToken = null;
        return {} as T;
    }

    // REFRESH
    if (url === '/auth/refresh') {
        if (!currentToken) throw new Error('No active session');
        const newToken = btoa(`refresh:${Date.now()}`);
        currentToken = newToken;
        return { token: newToken } as unknown as T;
    }

    // FORGOT PASSWORD
    if (url === '/auth/forgot-password') {
        const { email } = body ?? {};
        if (!users.some(u => u.email === email)) throw new Error('Email not found');
        return { message: 'Password reset email sent' } as unknown as T;
    }

    // RESET PASSWORD
    if (url === '/auth/reset-password') {
        const { token, password } = body ?? {};
        if (!token) throw new Error('Invalid token');
        if (users.length > 0) users[0].password = password;
        return { message: 'Password successfully reset' } as unknown as T;
    }

    throw new Error(`Unknown POST /auth endpoint: ${url}`);
}

export async function get<T = any>(url: string, config?: any): Promise<T> {
    // CURRENT USER
    if (url === '/auth/me') {
        if (!currentToken) throw new Error('Not authenticated');
        const { password: _p, ...safeUser } = users[0];
        return safeUser as unknown as T;
    }

    throw new Error(`Unknown GET /auth endpoint: ${url}`);
}
