import { Product } from '../models/product';
import { BasketItem } from '../models/basket';

export class Basket {
    private items: BasketItem[] = [];

    // Добавлять товар
    addItem(product: Product): void {
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                product,
                quantity: 1
            });
        }
        console.log(`Добавлен товар: ${product.title}`);
    }

    // Удалять товар
    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.product.id !== productId);
        console.log(`Удален товар ID: ${productId}`);
    }

    // Получить количество товаров (общее)
    getCount(): number {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Список товаров
    getItems(): BasketItem[] {
        return this.items;
    }

    // Сумма стоимости товаров
    getTotal(): number {
        return this.items.reduce((total, item) => {
            const price = item.product.price || 0;
            return total + (price * item.quantity);
        }, 0);
    }

    // Узнать наличие товара
    hasItem(productId: string): boolean {
        return this.items.some(item => item.product.id === productId);
    }

    // Очистить корзину
    clear(): void {
        this.items = [];
        console.log('Корзина очищена');
    }

    // Изменить количество товара
    updateQuantity(productId: string, quantity: number): void {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
            }
        }
    }
}