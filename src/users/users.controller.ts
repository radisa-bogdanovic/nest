import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from 'common/enums/role.enums';
import { Roles } from 'common/filters/decorators/roles.decorator';
import { UsersService } from './users.service';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUsersDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll(@Query() query: FindUsersDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsersDto,
    @Req() req: any,
  ) {
    return this.userService.update(id, dto, req);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.userService.remove(id, req);
  }
}
