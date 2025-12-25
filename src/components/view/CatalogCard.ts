import { Card } from './Card';
import { ICard } from '../../types';
import { EventEmitter } from '../base/Events';

export class CatalogCard extends Card<ICard> {
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this.container.addEventListener('click', () => {
            if (this.id) {
                this._events.emit('card:select', { id: this.id });
            }
        });
    }
}