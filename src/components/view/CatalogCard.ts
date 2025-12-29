import { Card } from './Card';
import { ICard } from '../../types';
import { EventEmitter } from '../base/Events';

export class CatalogCard extends Card<ICard> {
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this.container.addEventListener('click', () => {
            const id = this.container.dataset.id; // Получаем id из dataset
            if (id) {
                this._events.emit('card:select', { id });
            }
        });
    }

    render(data: ICard): HTMLElement {
        super.render(data);
        this.container.dataset.id = data.id; // Сохраняем id в dataset
        return this.container;
    }
}