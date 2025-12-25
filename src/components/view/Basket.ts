import { Component } from '../base/Component';
import { Product, IBasketView } from '../../types';
import { BasketCard } from './BasketCard';
import { EventEmitter } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class BasketView extends Component<IBasketView> {
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _button: HTMLElement;
    private _cards: BasketCard[] = [];
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this._list = container.querySelector('.basket__list')!;
        this._total = container.querySelector('.basket__price')!;
        this._button = container.querySelector('.basket__button')!;
        
        this._button.addEventListener('click', () => {
            this._events.emit('basket:order');
        });
    }

    set items(products: Product[]) {
        this._list.innerHTML = '';
        this._cards = [];
        
        if (products.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'Корзина пуста';
            emptyItem.className = 'basket__empty';
            this._list.appendChild(emptyItem);
            return;
        }
        
        products.forEach((product, index) => {
            const cardElement = cloneTemplate<HTMLElement>('#card-basket');
            const card = new BasketCard(cardElement, this._events);
            const renderedCard = card.render({ 
                ...product, 
                index: index + 1 
            });
            this._cards.push(card);
            this._list.appendChild(renderedCard);
        });
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set valid(value: boolean) {
        this.setDisabled(this._button, !value);
    }
}