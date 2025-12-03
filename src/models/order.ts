export type PaymentMethod = 'card' | 'cash' | '';

export interface OrderForm {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}