// src/components/models/BaseModel.ts
import { EventEmitter } from '../base/Events';

/**
 * Базовый класс для всех моделей данных
 */
export abstract class BaseModel {
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }
}