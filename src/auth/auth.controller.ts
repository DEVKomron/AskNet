import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { ApiOperation } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { CookieGetter } from '../decorators/cookie-getter.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.signUp(createAdminDto);
  }

  @ApiOperation({ summary: "Tizimga kirish"})
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true}) res:Response
  ){
    return this.authService.signIn(signInDto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Get("sign-out")
  signout(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(refreshToken, res)
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
