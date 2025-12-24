// src/components/view/Header.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected _basketButton: HTMLButtonElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        
        const basketButton = container.querySelector('.header__basket');
        const counter = container.querySelector('.header__basket-counter');
        
        if (!basketButton || !counter) {
            throw new Error('Не найдены элементы шапки');
        }
        
        this._basketButton = basketButton as HTMLButtonElement;
        this._counter = counter as HTMLElement;

        this._basketButton.addEventListener('click', () => {
            this.events.emit('header:basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, value);
    }
}