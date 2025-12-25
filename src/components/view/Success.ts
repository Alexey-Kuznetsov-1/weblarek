import { Component } from '../base/Component';
import { ISuccessView } from '../../types';
import { EventEmitter } from '../base/Events';

export class SuccessView extends Component<ISuccessView> {
    private _totalElement: HTMLElement;
    private _closeButton: HTMLButtonElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this._totalElement = container.querySelector('.order-success__description')!;
        this._closeButton = container.querySelector('.order-success__close')!;
        
        this._closeButton.addEventListener('click', () => {
            this._events.emit('success:close');
        });
    }

    set total(value: number) {
        this.setText(this._totalElement, `Списано ${value} синапсов`);
    }
}