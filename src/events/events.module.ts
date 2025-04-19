import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { EventConsumerService } from './event-consumer/event-consumer.service';
import { EventProducerService } from './event-producer/event-producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'event_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [EventProducerService, EventConsumerService],
  exports: [EventProducerService],
})
export class EventModule {}
