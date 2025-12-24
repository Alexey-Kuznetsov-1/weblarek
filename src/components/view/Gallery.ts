// src/components/view/Gallery.ts
import { Component } from '../base/Component';

interface IGallery {
    items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(value: HTMLElement[]) {
        // Очищаем контейнер
        this.container.innerHTML = '';
        
        // Добавляем все элементы
        value.forEach(item => {
            this.container.appendChild(item);
        });
    }
}