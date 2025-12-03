// src/api/api-client.ts
import { IApi, ApiPostMethods } from '../types';

export class ApiClient implements IApi {
    constructor(private baseUrl: string, private options: RequestInit = {}) {}

    async get<T extends object>(uri: string): Promise<T> {
        // Убираем baseUrl из uri, так как он уже в baseUrl
        const url = `${this.baseUrl}${uri}`;
        console.log('GET запрос:', url);
        
        const response = await fetch(url, {
            ...this.options,
            method: 'GET',
        });
        return this.handleResponse(response);
    }

    async post<T extends object>(
        uri: string, 
        data: object, 
        method: ApiPostMethods = 'POST'
    ): Promise<T> {
        const url = `${this.baseUrl}${uri}`;
        console.log(`${method} запрос:`, url);
        
        const response = await fetch(url, {
            ...this.options,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...this.options.headers,
            },
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    private async handleResponse(response: Response): Promise<any> {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }
}