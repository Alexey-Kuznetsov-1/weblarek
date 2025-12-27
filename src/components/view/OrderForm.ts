import { Component } from '../base/Component';
import { IOrderFormView } from '../../types';
import { EventEmitter } from '../base/Events';

export class OrderFormView extends Component<IOrderFormView> {
    private _paymentButtons: HTMLElement[];
    private _addressInput: HTMLInputElement;
    private _submitButton: HTMLElement;
    private _errorContainer: HTMLElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this._paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
        this._addressInput = container.querySelector('input[name="address"]')!;
        this._submitButton = container.querySelector('.order__button')!;
        this._errorContainer = container.querySelector('.form__errors')!;

        // Обработчики для кнопок оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.getAttribute('name') as 'card' | 'cash';
                this.setPayment(payment);
            });
        });

        // Обработчик для адреса
        this._addressInput.addEventListener('input', () => {
            this._events.emit('order:address:changed', { 
                address: this._addressInput.value 
            });
        });

        // Обработчик для отправки формы
        this._submitButton.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this._events.emit('order:submit');
        });
    }

    // Метод для установки способа оплаты с визуальной подсветкой
    setPayment(payment: 'card' | 'cash') {
        // Убираем активный класс со всех кнопок
        this._paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        
        // Находим и активируем выбранную кнопку
        const selectedButton = this._paymentButtons.find(
            button => button.getAttribute('name') === payment
        );
        if (selectedButton) {
            selectedButton.classList.add('button_alt-active');
        }
        
        // Отправляем событие
        this._events.emit('order:payment:changed', { payment });
    }

    set payment(value: 'card' | 'cash') {
        this.setPayment(value);
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
}