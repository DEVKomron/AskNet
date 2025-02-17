import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Bot, BotSchema } from "./models/tg_user.model";
import { BotUpdate } from "./bot.update";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bot.name,
        schema: BotSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [BotService, BotUpdate],
  exports: [BotService]
})
export class BotModule {}
