import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports:[JwtModule.register({}),forwardRef(() => AdminModule)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
