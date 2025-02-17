import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Context, Telegraf } from "telegraf";
import { Bot } from "./models/tg_user.model";
import { Model } from "mongoose";
import { Markup } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot.name) private readonly botModel: Model<Bot>,
    @InjectBot(BOT_NAME) private bot: Telegraf<Context>
  ) {}

  async onStart(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      let user = await this.botModel.findOne({ user_id });

      if (!user) {
        user = new this.botModel({
          user_id,
          username: ctx.from?.username,
          first_name: ctx.from?.first_name,
          last_name: ctx.from?.last_name,
          lang: ctx.from?.language_code,
          status:true,
          last_state: "phone_number",
        });
        await user.save();
      }
      if(user && !user.status){
        user.status = true
        await user.save()
      }
      if(user && user.last_state == "phone_number"){
        ctx.reply(
          `Assalomu Alaykum ${ctx.from.first_name}, Iltimos telefon raqamingizni ulashing`,
          {
            parse_mode: "HTML",
            ...Markup.keyboard([
              Markup.button.contactRequest("Kontaktni ulashish📞"),
            ])
              .resize()
              .oneTime(),
          }
        );
      }
    } catch (error) {
      console.log("onStart error: ", error);
    }
  }

  async onContact(ctx: Context) {
    try {
      if ("contact" in ctx.message!) {
        const user_id = ctx.from?.id;
        let user = await this.botModel.findOne({ user_id : String(user_id) });
        console.log(user);

        if (!user || !user.status) {
          return await ctx.reply(`Siz avval botni qayta ishlatishingiz kerak`, {
            parse_mode: "HTML",
            ...Markup.keyboard([["/start"]]).resize(),
          });
        }

        if (user && user.last_state == "phone_number") {
          user.phone_number = ctx.message.contact.phone_number
          user.last_name = "real_name"
          await user.save()
          await ctx.reply(`Iltimos haqiqiy ismingizni kiriting:`, {
            ...Markup.removeKeyboard()
          })
        }
      }
    } catch (error) {
      console.log("Xatolik yuz berdi:", error);
    }
  }
}
