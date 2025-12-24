// src/components/view/CatalogCard.ts
import { Card } from './Card';
import { EventEmitter } from '../base/Events';
import { Product } from '../../types';

export class CatalogCard extends Card<{}> {
    protected _id: string;

    constructor(
        container: HTMLElement,
        events: EventEmitter,
        product: Product
    ) {
        super(container, events);
        this._id = product.id;

        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this._id });
        });

        this.title = product.title;
        this.image = product.image;
        this.category = product.category;
        this.price = product.price;
    }
}