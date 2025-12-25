import { Component } from '../base/Component';
import { IHeader } from '../../types';
import { EventEmitter } from '../base/Events';

export class Header extends Component<IHeader> {
    private _basketButton: HTMLElement;
    private _counter: HTMLElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this._basketButton = container.querySelector('.header__basket')!;
        this._counter = this._basketButton.querySelector('.header__basket-counter')!;
        
        this._basketButton.addEventListener('click', () => {
            this._events.emit('header:basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }
}