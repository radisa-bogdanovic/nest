import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthValidatorDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { RefreshAuthGuard } from './refresh-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/loginResponse.dto';

import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: AuthValidatorDto) {
    return this.authService.register(dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Uspesan login',
    type: LoginResponseDto,
  })
  @Public()
  @Post('login')
  async login(
    @Body() dto: AuthValidatorDto,
    @Res({
      passthrough: true,
    })
    res: any,
  ) {
    const tokens = await this.authService.login(dto);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    return { accessToken: tokens.accessToken };
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
  async logout(
    @Req() req: any,
    @Res({
      passthrough: true,
    })
    res: any,
  ) {
    await this.authService.logout(req.user.userId);
    res.clearCookie('accessToken', {
      path: '/',
      secure: true,
      sameSite: 'none',
    });
    res.clearCookie('refreshToken', {
      path: '/auth/refresh',
      secure: true,
      sameSite: 'none',
    });
    return { message: 'Uspesan logout' };
  }

  // @Post()
  // create(@Body() createNoteDto: CreateNoteDto, @Req() req: any) {
  //   return this.authService.create(createNoteDto, req);
  // }

  @Get('me')
  myDetails(@Req() req: any) {
    return this.usersService.findOne(req.user.userId);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateNoteDto: UpdateNoteDto,
  //   @Req() req: any,
  // ) {
  //   return this.authService.update(id, updateNoteDto, req);
  // }
}
