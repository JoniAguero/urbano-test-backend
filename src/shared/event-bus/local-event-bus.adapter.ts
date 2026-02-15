import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '../domain/domain-event';
import { EventBus } from './event-bus.port';

@Injectable()
export class LocalEventBus implements EventBus {
    private readonly logger = new Logger(LocalEventBus.name);

    constructor(private readonly eventEmitter: EventEmitter2) { }

    async publish(event: DomainEvent): Promise<void> {
        this.logger.log(
            `Publishing event [${event.eventType}]: ${JSON.stringify(event.toJSON())}`,
        );
        this.eventEmitter.emit(event.eventType, event);
    }
}
