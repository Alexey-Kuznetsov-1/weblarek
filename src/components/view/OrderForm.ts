import { Component } from '../base/Component';
import { IOrderFormView } from '../../types';
import { EventEmitter } from '../base/Events';

export class OrderFormView extends Component<IOrderFormView> {
    private _paymentButtons: NodeListOf<HTMLElement>;
    private _addressInput: HTMLInputElement;
    private _submitButton: HTMLElement;
    private _errorContainer: HTMLElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this._paymentButtons = container.querySelectorAll('.button_alt');
        this._addressInput = container.querySelector('input[name="address"]')!;
        this._submitButton = container.querySelector('.order__button')!;
        this._errorContainer = container.querySelector('.form__errors')!;

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.getAttribute('name') as 'card' | 'cash' | '';
                this._events.emit('order:payment:changed', { payment });
            });
        });

        this._addressInput.addEventListener('input', () => {
            this._events.emit('order:address:changed', { address: this._addressInput.value });
        });

        this._submitButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this._events.emit('order:submit');
        });
    }

    set payment(value: 'card' | 'cash' | '') {
        this._paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
            if (button.getAttribute('name') === value) {
                button.classList.add('button_alt-active');
            }
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set valid(value: boolean) {
        this.setDisabled(this._submitButton, !value);
    }

    set errors(messages: string[]) {
        if (messages.length > 0) {
            this._errorContainer.textContent = messages.join(', ');
            this._errorContainer.style.display = 'block';
        } else {
            this._errorContainer.style.display = 'none';
        }
    }

    clear() {
        this._addressInput.value = '';
        this._paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        this.errors = [];
    }
}