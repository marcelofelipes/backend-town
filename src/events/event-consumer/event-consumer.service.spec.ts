import { Test, TestingModule } from '@nestjs/testing';
import { EventConsumerService } from './event-consumer.service';

describe('EventConsumerService', () => {
  let service: EventConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventConsumerService],
    }).compile();

    service = module.get<EventConsumerService>(EventConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
