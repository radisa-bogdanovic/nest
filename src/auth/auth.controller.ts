import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: AuthValidatorDto) {
    return this.authService.register(dto);
  }

  @ApiBody({ type: AuthValidatorDto })
  @ApiResponse({
    status: 200,
    description: 'Uspesan login',
    type: LoginResponseDto,
  })
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
