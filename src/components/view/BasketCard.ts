import { Component } from '../base/Component';
import { IBasketItem } from '../../types';
import { EventEmitter } from '../base/Events';

export class BasketCard extends Component<IBasketItem> {
    private _indexElement: HTMLElement;
    private _titleElement: HTMLElement;
    private _priceElement: HTMLElement;
    private _deleteButton: HTMLElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this._indexElement = container.querySelector('.basket__item-index')!;
        this._titleElement = container.querySelector('.card__title')!;
        this._priceElement = container.querySelector('.card__price')!;
        this._deleteButton = container.querySelector('.basket__item-delete')!;
        
        this._deleteButton.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this._events.emit('basket:remove', { id });
            }
        });
    }

    render(data: IBasketItem): HTMLElement {
        this._indexElement.textContent = data.index.toString();
        this._titleElement.textContent = data.title;
        this._priceElement.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';
        this.container.dataset.id = data.id;
        
        return this.container;
    }
}