// src/components/view/BasketCard.ts
import { Card } from './Card';
import { EventEmitter } from '../base/Events';
import { Product } from '../../types';

interface IBasketCard {
    title: string;
    price: number;
    index: number;
}

export class BasketCard extends Card<IBasketCard> {
    protected _id: string;
    protected _deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        product: Product,
        index: number
    ) {
        super(container, events);
        this._id = product.id;
        
        const deleteButton = this.container.querySelector('.basket__item-delete');
        if (!deleteButton) {
            throw new Error('Кнопка удаления не найдена в шаблоне корзины');
        }
        this._deleteButton = deleteButton as HTMLButtonElement;
        
        this._deleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: this._id });
        });

        this.title = product.title;
        this.price = product.price || 0;
        this.index = index;
    }
}