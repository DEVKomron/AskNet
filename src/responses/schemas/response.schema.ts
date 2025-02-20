import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date, HydratedDocument } from "mongoose";
import { Bot } from "src/bot/schemas/bot.schema";

export type ResponseDocument = HydratedDocument<Response>;

@Schema()
export class Response {

    @Prop()
    participant_id: number;
    @Prop()
    question_id: number;    
    @Prop()
    selected_options: number;
    @Prop()
    text_response: string;
    @Prop()
    numeric_response:number;
    @Prop()
    image: string;
  @Prop({type : mongoose.Schema.ObjectId, ref: "Bot"})
  question:Bot;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
