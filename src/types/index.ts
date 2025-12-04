export type ProductCategory = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';

export interface Product {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ProductCategory;
    price: number | null;
}

export type PaymentMethod = 'card' | 'cash' | '';

export interface OrderForm {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}

// Запрос на создание заказа (расширяет OrderForm)
export interface OrderRequest extends OrderForm {
    total: number;
    items: string[];
}

export interface ProductListResponse {
    total: number;
    items: Product[];
}