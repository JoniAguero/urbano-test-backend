import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EVENT_BUS } from './tokens';
import { LocalEventBus } from './event-bus/local-event-bus.adapter';
import { SnsEventBus } from './event-bus/sns-event-bus.adapter';
import { SqsConsumerService } from './event-bus/sqs-consumer.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Global()
@Module({
    imports: [EventEmitterModule.forRoot(), ConfigModule],
    providers: [
        {
            provide: EVENT_BUS,
            useFactory: (configService: ConfigService, eventEmitter: EventEmitter2) => {
                const useAws = configService.get<string>('aws.snsTopicArn');
                if (useAws) {
                    return new SnsEventBus(configService);
                }
                return new LocalEventBus(eventEmitter);
            },
            inject: [ConfigService, EventEmitter2],
        },
        SqsConsumerService,
    ],
    exports: [EVENT_BUS],
})
export class SharedModule { }
