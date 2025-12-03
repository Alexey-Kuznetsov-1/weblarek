import { OrderForm } from '../models/order';

export class Order {
    private data: OrderForm = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    };

    // Сохранение данных
    setData(data: Partial<OrderForm>): void {
        this.data = { ...this.data, ...data };
        console.log('Данные заказа обновлены:', this.data);
    }

    // Получение данных
    getData(): OrderForm {
        return this.data;
    }

    // Проверка данных
    validate(): boolean {
        const errors = [];
        
        if (!this.data.payment) {
            errors.push('Не выбран способ оплаты');
        }
        
        if (!this.data.address.trim()) {
            errors.push('Не указан адрес');
        }
        
        if (!this.data.email.trim() || !this.isValidEmail(this.data.email)) {
            errors.push('Неверный email');
        }
        
        if (!this.data.phone.trim()) {
            errors.push('Не указан телефон');
        }
        
        if (errors.length > 0) {
            console.log('❌ Ошибки валидации:', errors);
            return false;
        }
        
        console.log('✅ Данные заказа валидны');
        return true;
    }

    // Проверка email
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Очистить данные
    clear(): void {
        this.data = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        };
        console.log('Данные заказа очищены');
    }
}