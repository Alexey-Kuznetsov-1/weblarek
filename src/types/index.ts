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

// Базовый интерфейс для компонентов
export interface IComponent<T extends object> {
    // Базовые методы компонента
    render(data?: Partial<T>): HTMLElement;
}

// Типы для View компонентов
export interface ICard {
    id: string;
    title: string;
    image: string;
    category: ProductCategory;
    price: number | null;
    description?: string;
    buttonText?: string;
    buttonDisabled?: boolean;
    index?: number;
}

export interface IGallery {
    items: HTMLElement[];
}

export interface IHeader {
    counter: number;
}

export interface IModal {
    content: HTMLElement;
}

// Новый тип для элемента корзины
export interface IBasketItem {
    id: string;
    title: string;
    price: number | null;
    index: number;
}

// Обновленный тип для BasketView
export interface IBasketView {
    items: HTMLElement[]; // Теперь принимает готовые элементы, а не Product[]
    total: number;
    valid: boolean;
}

export interface IOrderFormView {
    payment: PaymentMethod;
    address: string;
    valid: boolean;
    errors: string[];
}

export interface IContactsFormView {
    email: string;
    phone: string;
    valid: boolean;
    errors: string[];
}

export interface ISuccessView {
    total: number;
}

// Типы для событий
export interface CardSelectEvent {
    id: string;
}

export interface BasketItemEvent {
    id: string;
}

export interface OrderPaymentEvent {
    payment: PaymentMethod;
}

export interface OrderAddressEvent {
    address: string;
}

export interface OrderEmailEvent {
    email: string;
}

export interface OrderPhoneEvent {
    phone: string;
}

// Дополнительные типы для TypeScript
export type FormErrors = Partial<Record<keyof OrderForm, string>>;

// Тип для данных формы заказа в модели
export interface OrderFormData {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}

// Тип для данных формы контактов
export interface ContactsFormData {
    email: string;
    phone: string;
    valid: boolean;
    errors: string[];
}

// Тип для BasketView данных
export interface BasketViewData {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

// Тип для OrderFormView данных
export interface OrderFormDataView {
    payment: PaymentMethod;
    address: string;
    valid: boolean;
    errors: string[];
}