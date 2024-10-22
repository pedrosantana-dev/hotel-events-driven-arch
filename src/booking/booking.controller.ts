import { Body, Controller, Inject, Post } from '@nestjs/common';
import * as Decider from './booking.decider';
import { EventStoreDBClient } from '@eventstore/db-client';
import { createCommandHandler } from 'src/utils/command-handler';
import { IsDateString, IsString } from 'class-validator';

class BookRoomDto {
  @IsString()
  roomId: string;

  @IsString()
  customerId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

@Controller('booking')
export class BookingController {
  private readonly handle: (command: Decider.Command) => Promise<any>;

  constructor(
    @Inject('EVENT_STORE') private readonly client: EventStoreDBClient,
  ) {
    this.handle = createCommandHandler(
      this.client,
      (cmd) => `Booking-${cmd.data.roomId}`,
      Decider,
    );
  }

  @Post('book')
  async bookRoom(
    @Body() { roomId, customerId, startDate, endDate }: BookRoomDto,
  ) {
    return await this.handle({
      type: 'BookRoom',
      data: { roomId, customerId, startDate, endDate },
    });
  }
}
