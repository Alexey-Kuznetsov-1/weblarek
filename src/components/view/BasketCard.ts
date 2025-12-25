import { Card } from './Card';
import { ICard } from '../../types';
import { EventEmitter } from '../base/Events';

export class BasketCard extends Card<ICard> {
    private _button: HTMLElement | null = null;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        const buttonElement = container.querySelector('.basket__item-delete');
        if (buttonElement) {
            this._button = buttonElement as HTMLElement;
            this._button.addEventListener('click', (event) => {
                event.preventDefault();
                if (this.id) {
                    this._events.emit('basket:remove', { id: this.id });
                }
            });
        }
    }

    set index(value: number) {
        const indexElement = this.container.querySelector('.basket__item-index');
        if (indexElement) {
            this.setText(indexElement as HTMLElement, String(value));
        }
    }
}