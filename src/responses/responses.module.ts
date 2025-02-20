import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Response, ResponseSchema } from './schemas/response.schema';
import { Bot, BotSchema } from 'src/bot/schemas/bot.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        {
          name: Response.name,
          schema: ResponseSchema
        },
        {
          name: Bot.name,
          schema: BotSchema
        },

      ])
    ],
  controllers: [ResponsesController],
  providers: [ResponsesService],
})
export class ResponsesModule {}
