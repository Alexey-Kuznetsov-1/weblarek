import { Component } from '../base/Component';
import { IContactsFormView } from '../../types';
import { EventEmitter } from '../base/Events';

export class ContactsFormView extends Component<IContactsFormView> {
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;
    private _submitButton: HTMLElement;
    private _errorContainer: HTMLElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this._emailInput = container.querySelector('input[name="email"]')!;
        this._phoneInput = container.querySelector('input[name="phone"]')!;
        this._submitButton = container.querySelector('button[type="submit"]')!;
        this._errorContainer = container.querySelector('.form__errors')!;

        this._emailInput.addEventListener('input', () => {
            this._events.emit('order:email:changed', { email: this._emailInput.value });
        });

        this._phoneInput.addEventListener('input', () => {
            this._events.emit('order:phone:changed', { phone: this._phoneInput.value });
        });

        this._submitButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this._events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
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
}