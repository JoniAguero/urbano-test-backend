import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} from '@aws-sdk/client-sqs';

@Injectable()
export class SqsConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(SqsConsumerService.name);
    private readonly sqsClient: SQSClient;
    private readonly queueUrl: string;
    private polling = false;

    constructor(
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2,
    ) {
        this.sqsClient = new SQSClient({
            region: this.configService.get<string>('aws.region', 'us-east-1'),
        });
        this.queueUrl = this.configService.get<string>('aws.sqsQueueUrl');
    }

    onModuleInit() {
        if (this.queueUrl) {
            this.polling = true;
            this.poll();
        }
    }

    onModuleDestroy() {
        this.polling = false;
    }

    private async poll(): Promise<void> {
        while (this.polling) {
            try {
                const command = new ReceiveMessageCommand({
                    QueueUrl: this.queueUrl,
                    MaxNumberOfMessages: 10,
                    WaitTimeSeconds: 20,
                    MessageAttributeNames: ['eventType'],
                });

                const response = await this.sqsClient.send(command);

                if (response.Messages) {
                    for (const message of response.Messages) {
                        await this.handleMessage(message);
                    }
                }
            } catch (error) {
                this.logger.error(`Error polling SQS: ${error.message}`, error.stack);
                // Wait before retrying on error
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
    }

    private async handleMessage(message: any): Promise<void> {
        try {
            const body = JSON.parse(message.Body);
            // SNS wraps the message, extract the actual payload
            const payload = body.Message ? JSON.parse(body.Message) : body;
            const eventType =
                message.MessageAttributes?.eventType?.StringValue ||
                payload.eventType;

            this.logger.log(`Received SQS message [${eventType}]`);

            // Dispatch to local event handlers
            this.eventEmitter.emit(eventType, payload);

            // Delete message from queue after successful processing
            await this.sqsClient.send(
                new DeleteMessageCommand({
                    QueueUrl: this.queueUrl,
                    ReceiptHandle: message.ReceiptHandle,
                }),
            );
        } catch (error) {
            this.logger.error(
                `Error processing SQS message: ${error.message}`,
                error.stack,
            );
        }
    }
}
