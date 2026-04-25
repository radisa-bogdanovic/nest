import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthValidatorDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: AuthValidatorDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: AuthValidatorDto) {
    return this.authService.login(dto);
  }
}
