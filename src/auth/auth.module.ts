import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RefreshStrategy } from './refresh.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStategy, RefreshStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
