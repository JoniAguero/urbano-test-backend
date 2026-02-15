import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { DomainEvent } from '../domain/domain-event';
import { EventBus } from './event-bus.port';

@Injectable()
export class SnsEventBus implements EventBus {
    private readonly logger = new Logger(SnsEventBus.name);
    private readonly snsClient: SNSClient;
    private readonly topicArn: string;

    constructor(private readonly configService: ConfigService) {
        this.snsClient = new SNSClient({
            region: this.configService.get<string>('aws.region', 'us-east-1'),
        });
        this.topicArn = this.configService.get<string>('aws.snsTopicArn');
    }

    async publish(event: DomainEvent): Promise<void> {
        const message = JSON.stringify(event.toJSON());

        this.logger.log(
            `Publishing event [${event.eventType}] to SNS: ${message}`,
        );

        const command = new PublishCommand({
            TopicArn: this.topicArn,
            Message: message,
            MessageAttributes: {
                eventType: {
                    DataType: 'String',
                    StringValue: event.eventType,
                },
            },
        });

        await this.snsClient.send(command);
    }
}
