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

export interface OrderRequest extends OrderForm {
    total: number;
    items: string[];
}

export interface ProductListResponse {
    total: number;
    items: Product[];
}

export interface IComponent<T extends object> {
    render(data?: Partial<T>): HTMLElement;
}

// Тип для карточек каталога и предпросмотра
export interface ICard {
    id: string;
    title: string;
    image: string;
    category: ProductCategory;
    price: number | null;
    description?: string;
    buttonText?: string;
    buttonDisabled?: boolean;
    // НЕТ index здесь!
}

// Отдельный тип для элементов корзины
export interface IBasketItem {
    id: string;
    title: string;
    price: number | null;
    index: number; // ТОЛЬКО здесь есть index
}

export interface IBasketView {
    items: HTMLElement[];
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

export interface IGallery {
    items: HTMLElement[];
}

export interface IHeader {
    counter: number;
}

export interface IModal {
    content: HTMLElement;
}

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

export type FormErrors = Partial<Record<keyof OrderForm, string>>;

export interface OrderFormData {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}

export interface ContactsFormData {
    email: string;
    phone: string;
    valid: boolean;
    errors: string[];
}

export interface BasketViewData {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

export interface OrderFormDataView {
    payment: PaymentMethod;
    address: string;
    valid: boolean;
    errors: string[];
}