import { OrderForm } from '../../types';
import { BaseModel } from './BaseModel';
import { EventEmitter } from '../base/Events';

export class Order extends BaseModel {
    private data: OrderForm = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    };

    constructor(events: EventEmitter) {
        super(events);
    }

    // Сохранение данных
    setData(data: Partial<OrderForm>): void {
        this.data = { ...this.data, ...data };
        this.events.emit('order:changed', { data: this.data });
    }

    // Получение данных
    getData(): OrderForm {
        return this.data;
    }

    // Валидация данных с возвратом объекта ошибок
    validate(): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        
        if (!this.data.address.trim()) {
            errors.address = 'Не указан адрес доставки';
        }
        
        if (!this.data.email.trim()) {
            errors.email = 'Не указан email';
        } else if (!this.isValidEmail(this.data.email)) {
            errors.email = 'Некорректный формат email';
        }
        
        if (!this.data.phone.trim()) {
            errors.phone = 'Не указан телефон';
        }

        return errors;
    }

    // Проверка email
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Проверка, есть ли ошибки (удобный метод для UI)
    isValid(): boolean {
        return Object.keys(this.validate()).length === 0;
    }

    // Очистить данные
    clear(): void {
        this.data = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        };
        this.events.emit('order:changed', { data: this.data });
    }
}