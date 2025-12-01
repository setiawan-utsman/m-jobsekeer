import * as db from 'server/db.json';

let tasks: any[] = [...db.tasks];

export async function get<T = any>(url: string, config?: any): Promise<T> {
    if (url === '/tasks') {
        return tasks as unknown as T;
    }

    // Get single task
    const match = url.match(/\/tasks\/(\w+)/);
    if (match) {
        const task = tasks.find(c => c.id === match[1]);
        if (!task) throw new Error('Task not found');
        return task as unknown as T;
    }

    throw new Error(`Unknown GET /tasks endpoint: ${url}`);
}

export async function post<T = any>(url: string, body?: Partial<any>): Promise<T> {
    if (url === '/tasks') {
        if (!body) throw new Error('Task data is required');

        const newCategory: any = {
            id: String(Date.now()),
            title: body.name || '',
            description: body.description || '',
            status: body.status || '',
            priority: body.priority || 'high',
            dueDate: body.dueDate || '2024-07-15T00:00:00.000Z',
        };

        tasks.push(newCategory);
        return newCategory as unknown as T;
    }

    throw new Error(`Unknown POST /tasks endpoint: ${url}`);
}

export async function put<T = any>(url: string, body: Partial<any>): Promise<T> {
    const match = url.match(/\/tasks\/(\w+)/);
    if (match) {
        const id = match[1];
        const index = tasks.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Task not found');

        tasks[index] = {
            ...tasks[index],
            ...body
        };

        return tasks[index] as unknown as T;
    }

    throw new Error(`Unknown PUT /categories endpoint: ${url}`);
}

export async function del<T = any>(url: string): Promise<T> {
    const match = url.match(/\/tasks\/(\w+)/);
    if (match) {
        const id = match[1];
        const initialLength = tasks.length;
        tasks = tasks.filter(c => c.id !== id);
        if (tasks.length === initialLength) {
            throw new Error('Task not found');
        }

        return { message: 'Task deleted successfully' } as unknown as T;
    }

    throw new Error(`Unknown DELETE /tasks endpoint: ${url}`);
}