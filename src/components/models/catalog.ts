import { Product } from '../../types';
import { BaseModel } from './BaseModel';
import { EventEmitter } from '../base/Events';

export class Catalog extends BaseModel {
    private items: Product[] = [];
    private selectedItem: Product | null = null;

    constructor(events: EventEmitter) {
        super(events);
    }

    // Сохранить массив товаров
    setItems(items: Product[]): void {
        this.items = items;
        this.events.emit('catalog:changed'); // ✅ Событие вызывается здесь
    }

    // Получить массив товаров
    getItems(): Product[] {
        return this.items;
    }

    // Сохранить выбранную карточку
    setPreview(item: Product): void {
        this.selectedItem = item;
        this.events.emit('preview:changed'); // ✅ Событие вызывается здесь
    }

    // Получить выбранную карточку
    getPreview(): Product | null {
        return this.selectedItem;
    }

    // Найти товар по ID
    getProductById(id: string): Product | undefined {
        return this.items.find(item => item.id === id);
    }

    // Очистить выбранный товар
    clearPreview(): void {
        this.selectedItem = null;
        this.events.emit('preview:changed'); // ✅ Событие вызывается здесь
    }
}