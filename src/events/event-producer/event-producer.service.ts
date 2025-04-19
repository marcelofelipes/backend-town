import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventProducerService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async emitEvent(pattern: string, data: any) {
    return this.client.emit(pattern, data);
  }
}
