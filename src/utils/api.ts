import { API_URL } from './constants';
import { ProductListResponse, OrderRequest } from '../types';

/**
 * Получить список товаров с сервера
 */
export async function getProductList(): Promise<ProductListResponse> {
    const response = await fetch(`${API_URL}/product/`);
    
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    return response.json();
}

/**
 * Создать заказ на сервере
 */
export async function createOrder(orderData: OrderRequest): Promise<{ id: string; total: number }> {
    const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    return response.json();
}