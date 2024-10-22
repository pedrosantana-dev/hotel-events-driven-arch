import {
  EventStoreDBClient,
  EventType,
  FORWARDS,
  jsonEvent,
  JSONType,
  START,
} from '@eventstore/db-client';

type Decider<S, E, C> = {
  initialState: S;
  evolve: (state: S, event: E) => S;
  decide: (state: S, command: C) => E[];
};

// Create a command handler that processes commands and updates the event store
export const createCommandHandler =
  <S, E extends EventType, C>(
    client: EventStoreDBClient,
    getStreamName: (command: C) => string,
    decider: Decider<S, E, C>,
  ) =>
  async (command: C, context?: any) => {
    const streamName = getStreamName(command);
    let state = decider.initialState;

    // Read events from the event store to reconstruct the current state
    const events = client.readStream(streamName, {
      fromRevision: START,
      direction: FORWARDS,
      maxCount: 10,
    });

    // Evolve the state based on the events
    try {
      for await (const event of events) {
        state = decider.evolve(state, event as E);
      }
    } catch (error) {
      console.log('[EVENTSTORE] Failed to read events:', error.message);
    }

    // Decide on new events based on the current state and command
    const newEvents = decider.decide(state, command).map((event) =>
      jsonEvent({
        type: event.type,
        data: event.data as JSONType,
        metadata: context,
      }),
    );

    // Append new events to the event store
    await client.appendToStream(streamName, newEvents);
    return { success: true };
  };
