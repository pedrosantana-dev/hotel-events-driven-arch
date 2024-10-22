import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import {
  Global,
  Inject,
  Module,
  OnApplicationBootstrap,
  Provider,
} from '@nestjs/common';

const EventStore: Provider = {
  provide: 'EVENT_STORE',
  useFactory: () =>
    EventStoreDBClient.connectionString(
      `esdb://admin:changeit@eventstoredb:2113?tls=false`,
    ),
};

@Global()
@Module({
  providers: [EventStore],
  exports: [EventStore],
})
export class EventStoreModule implements OnApplicationBootstrap {
  constructor(
    @Inject('EVENT_STORE') private readonly client: EventStoreDBClient,
  ) {}
  onApplicationBootstrap() {
    this.client.readAll({
      direction: FORWARDS,
      fromPosition: START,
      maxCount: 1,
    });
  }
}
