import { Api } from './base/Api';
import { ProductListResponse, OrderRequest } from '../types';

/**
 * Класс для выполнения запросов к API магазина
 */
export class ApiShop {
    constructor(protected api: Api) {}

    /**
     * Получить список товаров с сервера
     */
    async getProductList(): Promise<ProductListResponse> {
        return await this.api.get('/product/') as ProductListResponse;
    }

    /**
     * Создать заказ на сервере
     */
    async createOrder(orderData: OrderRequest): Promise<{ id: string; total: number }> {
        return await this.api.post('/order', orderData) as { id: string; total: number };
    }
}