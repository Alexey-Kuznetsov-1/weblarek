import { API_URL } from './constants';
import { Product } from '../models/product';

// Тип ответа от сервера для списка товаров
export interface ProductListResponse {
    total: number;
    items: Product[];
}

/**
 * Получить список товаров с сервера
 */
export async function getProductList(): Promise<ProductListResponse> {
    const response = await fetch(`${API_URL}/product/`);
    
    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
    }
    
    return response.json();
}

/**
 * Получить информацию о конкретном товаре
 */
export async function getProductItem(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/product/${id}`);
    
    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
    }
    
    return response.json();
}

/**
 * Оформить заказ
 */
export async function createOrder(orderData: any): Promise<any> {
    const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
    }
    
    return response.json();
}