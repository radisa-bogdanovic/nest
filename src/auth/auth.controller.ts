import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthValidatorDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { RefreshAuthGuard } from './refresh-auth.guard';

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
  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Req() req: any) {
    return this.authService.refreshToken(
      req.user.userId,
      req.user.refreshToken,
    );
  }

  @Post('logout')
  logout(@Req() req: any) {
    return this.authService.logout(req.user.userId);
  }
}
