import { EventStoreDBClient } from '@eventstore/db-client';
import { Global, Module, Provider } from '@nestjs/common';

const EventStore: Provider = {
  provide: 'EVET_STORE',
  useFactory: () =>
    EventStoreDBClient.connectionString(
      `esdb://admin:changeit@localhost:2113?tls=false`,
    ),
};

@Global()
@Module({
  providers: [EventStore],
  exports: [EventStore],
})
export class EventStoreModule {}
