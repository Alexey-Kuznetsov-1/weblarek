// src/components/view/PreviewCard.ts
import { Card } from './Card';
import { EventEmitter } from '../base/Events';
import { Product } from '../../types';

interface IPreviewCard {
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
    buttonText: string;
}

export class PreviewCard extends Card<IPreviewCard> {
    protected _id: string;
    protected _button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        product: Product
    ) {
        super(container, events);
        this._id = product.id;
        
        const button = this.container.querySelector('.card__button');
        if (!button) {
            throw new Error('Кнопка не найдена в шаблоне предпросмотра');
        }
        this._button = button as HTMLButtonElement;
        
        this._button.addEventListener('click', () => {
            this.handleButtonClick();
        });

        this.title = product.title;
        this.image = product.image;
        this.category = product.category;
        this.price = product.price;
        this.description = product.description;
    }

    private handleButtonClick(): void {
        const eventType = this._button.textContent === 'В корзину' ? 'card:add' : 'card:remove';
        this.events.emit(eventType, { id: this._id });
    }
}