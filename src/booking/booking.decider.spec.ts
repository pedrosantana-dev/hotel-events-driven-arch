import { FORWARDS, START } from '@eventstore/db-client';
import { createCommandHandler } from '../utils/command-handler';
import * as Decider from './booking.decider';

describe('Booking Command Handler', () => {
  let mockClient;
  let handle;

  beforeEach(() => {
    mockClient = {
      readStream: jest.fn().mockResolvedValue([]),
      appendToStream: jest.fn().mockResolvedValue({}),
    };
    handle = createCommandHandler(
      mockClient,
      (cmd) => `Booking-${cmd.data.roomId}`,
      Decider,
    );
  });

  it('should handle a BookRoom command correctly', async () => {
    const command = {
      type: 'BookRoom',
      data: {
        roomId: '101',
        customerId: '1',
        startDate: '2024-11-01',
        endDate: '2024-11-02',
      },
    };
    await handle(command);

    expect(mockClient.readStream).toHaveBeenCalledWith('Booking-101', {
      fromRevision: START,
      direction: FORWARDS,
      maxCount: 10,
    });
    expect(mockClient.appendToStream).toHaveBeenCalledWith('Booking-101', [
      expect.objectContaining({
        type: 'RoomBooked',
        data: command.data,
      }),
    ]);
  });
});
