import { Component } from '../base/Component';
import { IBasketView } from '../../types';
import { EventEmitter } from '../base/Events';

export class BasketView extends Component<IBasketView> {
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _button: HTMLElement;
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

    // Теперь принимаем готовые HTML элементы для списка
    set items(items: HTMLElement[]) {
        this._list.innerHTML = '';
        
        if (items.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'Корзина пуста';
            emptyItem.className = 'basket__empty';
            this._list.appendChild(emptyItem);
            return;
        }
        
        items.forEach(item => {
            if (item instanceof HTMLElement) {
                this._list.appendChild(item);
            }
        });
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set valid(value: boolean) {
        this.setDisabled(this._button, !value);
    }

    clear() {
        this._list.innerHTML = '';
        this.total = 0;
        this.valid = false;
    }
}