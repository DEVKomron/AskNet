import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './models/admin.shcema';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt"

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private readonly adminModel: Model<Admin>){}

  async create(createAdminDto: CreateAdminDto) {
    const {password, confirm_password} = createAdminDto

    if (password !== confirm_password){
      throw new BadRequestException("Parollar mos emas...")
    }
    const hashed_password = await bcrypt.hash(password, 7)
    return this.adminModel.create(
      {
        ...createAdminDto,
        hashed_password
      }
      )

  }

  async updateRefreshToken(id: any, hashed_token: string) {
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(
      id,
      {
        hashed_token,
      },
      { new: true }
    );
  
    return updatedAdmin;
  }

  findAll() {
    return this.adminModel.find()
  }

  findByEmail(email:string){
    return this.adminModel.findOne({email})
  }

  findOne(id: string) {
    return this.adminModel.findOne({id});
  }

  update(id: string, updateAdminDto: UpdateAdminDto) {
    return this.adminModel.findByIdAndUpdate(id,updateAdminDto)
  }

  remove(id:string) {
    return this.adminModel.findByIdAndDelete(id)
  }
}
