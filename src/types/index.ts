// src/types/index.ts

// API типы (уже есть)
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Наши интерфейсы данных
export type ProductCategory = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';

export interface Product {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ProductCategory;
    price: number | null;
}

export interface BasketItem {
    product: Product;
    quantity: number;
}

export type PaymentMethod = 'card' | 'cash' | '';

export interface OrderForm {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}

// Тип для ответа от API списка товаров
export interface ProductListResponse {
    total: number;
    items: Product[];
}

// Типы для заказа
export interface OrderRequest {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface OrderResponse {
    id: string;
    total: number;
}

// Для обратной совместимости
export type IProduct = Product;
export type IBuyer = OrderForm;