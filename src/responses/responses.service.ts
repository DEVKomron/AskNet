import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from './schemas/response.schema';
import { Bot } from 'src/bot/schemas/bot.schema';
import { Model } from 'mongoose';


@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<Response>,
    @InjectModel(Bot.name) private clientModel: Model<Bot>,
  ) {}
 async  create(createResponseDto: CreateResponseDto) {
    const response = new this.responseModel(createResponseDto);
    await response.save()
    return response
  }

  findAll() {
    return 
  }

  findOne(id: number) {
    return `This action returns a #${id} response`;
  }

  update(id: number, updateResponseDto: UpdateResponseDto) {
    return `This action updates a #${id} response`;
  }

  remove(id: number) {
    return `This action removes a #${id} response`;
  }
}
