import { Component } from '../base/Component';
import { IContactsFormView } from '../../types';
import { EventEmitter } from '../base/Events';

export class ContactsFormView extends Component<IContactsFormView> {
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;
    private _submitButton: HTMLElement;
    private _errorContainer: HTMLElement;
    private _events: EventEmitter;
    private _isFormValid: boolean = false;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this._emailInput = container.querySelector('input[name="email"]')!;
        this._phoneInput = container.querySelector('input[name="phone"]')!;
        this._submitButton = container.querySelector('button[type="submit"]')!;
        this._errorContainer = container.querySelector('.form__errors')!;

        // Обработчики изменения полей
        this._emailInput.addEventListener('input', () => {
            const email = this._emailInput.value;
            this._events.emit('order:email:changed', { email });
            this.validateForm();
        });

        this._phoneInput.addEventListener('input', () => {
            const phone = this._phoneInput.value;
            this._events.emit('order:phone:changed', { phone });
            this.validateForm();
        });

        // Обработчик отправки формы с предварительной проверкой
        this._submitButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            if (this._isFormValid) {
                this._events.emit('contacts:submit');
            }
        });
    }

    // Валидация формы
    private validateForm(): void {
        const email = this._emailInput.value.trim();
        const phone = this._phoneInput.value.trim();
        
        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);
        
        // Проверка телефона (минимум 10 цифр)
        const phoneDigits = phone.replace(/\D/g, '');
        const isPhoneValid = phoneDigits.length >= 10;
        
        this._isFormValid = isEmailValid && isPhoneValid;
        this.valid = this._isFormValid;
    }

    set email(value: string) {
        this._emailInput.value = value;
        this.validateForm();
    }

    set phone(value: string) {
        this._phoneInput.value = value;
        this.validateForm();
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
        this._emailInput.value = '';
        this._phoneInput.value = '';
        this.errors = [];
        this._isFormValid = false;
        this.valid = false;
    }
}