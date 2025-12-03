// src/api/web-larek-api.ts
import { IApi } from '../types';
import { Product, ProductListResponse, OrderRequest, OrderResponse } from '../types';

export class WebLarekAPI {
    constructor(private api: IApi) {}  // Только api клиент
    
    async getProductList(): Promise<Product[]> {
        try {
            const response = await this.api.get<ProductListResponse>('/product/');
            return response.items;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw error;
        }
    }
    
    async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
        try {
            const response = await this.api.post<OrderResponse>(
                '/order',
                orderData
            );
            return response;
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            throw error;
        }
    }
}