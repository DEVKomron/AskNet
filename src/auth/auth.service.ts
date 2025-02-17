import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AdminDocument } from '../admin/models/admin.shcema';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcrypt"
import { InternalServerErrorException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService
  ){}

  async getTokens(user: AdminDocument) {
    const payload = {
      id: user._id,
      is_active: user.is_active,
      is_creator: user.is_creator,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signUp(createAdminDto: CreateAdminDto) {
    const condiate = await this.adminService.findByEmail(createAdminDto.email);
    if (condiate) {
        throw new BadRequestException("Bunday foydalanuvchi mavjud")
    }
    const newAdmin = await this.adminService.create(createAdminDto);
    const response = {
        message:"Admin qoshildi...",
        adminId: newAdmin._id
    }

    return response
}

async signIn(signInDto: SignInDto, res: Response) {

  const { email, password } = signInDto

  if (!email || !password) {
      throw new BadRequestException()
  }

  const admin = await this.adminService.findByEmail(email)

  if (!admin) {
      throw new UnauthorizedException('Invalid Email or password')
  }
  if (!admin.is_active) {
      throw new UnauthorizedException('Admin is not activate')
  }
  const validPassword = await bcrypt.compare(signInDto.password, admin.hashed_password)
  if (!validPassword) {
      throw new UnauthorizedException('Invalid Email or password')
  }

  const tokens = await this.getTokens(admin);

  const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7)

  const updateAdmin = await this.adminService.updateRefreshToken(
      admin._id,
      hashed_refresh_token
  )
  if (!updateAdmin) {
      throw new InternalServerErrorException("Tokenni saqlashda xatolik")
  }
  res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 100,
      httpOnly: true
  })
  const response = {
      message: "Admin logged in",
      adminId: admin._id,
      access_token: tokens.access_token
  };

  return response
}

async signOut(refreshToken: string, res: Response) {
  const adminData = await this.jwtService.verify(refreshToken, {
    secret: process.env.REFRESH_TOKEN_KEY,
  });
  if (!adminData) {
    throw new ForbiddenException("Admin not verified");
  }
  const hashed_refresh_token = null;
  await this.adminService.updateRefreshToken(
    adminData._id,
    hashed_refresh_token
  );

  res.clearCookie("refresh_token");

  const response = {
    message: "Logged out successfully",
  };
  return response;
}

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
