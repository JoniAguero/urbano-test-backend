export abstract class DomainEvent {
    public readonly occurredAt: Date;

    constructor(public readonly eventType: string) {
        this.occurredAt = new Date();
    }

    toJSON(): Record<string, unknown> {
        return {
            eventType: this.eventType,
            occurredAt: this.occurredAt.toISOString(),
        };
    }
}
