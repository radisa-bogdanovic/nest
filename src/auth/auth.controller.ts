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
import { Roles } from '../../common/filters/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enums';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
      sameSite: 'lax',
      path: 'auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    res.clearCookie('refreshToken', { path: 'auth/refresh' });
    return { message: 'Uspesan logout' };
  }

  // @Post()
  // create(@Body() createNoteDto: CreateNoteDto, @Req() req: any) {
  //   return this.authService.create(createNoteDto, req);
  // }
  @Roles(Role.ADMIN)
  @Get('users/')
  findAll() {
    return this.authService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get('user/:id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.authService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateNoteDto: UpdateNoteDto,
  //   @Req() req: any,
  // ) {
  //   return this.authService.update(id, updateNoteDto, req);
  // }
  @Roles(Role.ADMIN)
  @Delete('user/:id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.authService.remove(id, req);
  }
}
