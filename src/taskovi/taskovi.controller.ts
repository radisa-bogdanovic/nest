import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';

@Controller('taskovi')
export class TaskoviController {
  // necemo raditi trenutno sa servisom
  @Get('svi-taskovi')
  getTasks(@Query('zavrsen') zavrsen) {
    return zavrsen ? zavrsen : [];
  }
  @Get(':id')
  getTask(@Param('id') id) {
    return id;
  }

  @Post('napravi')
  createTask(@Body() body: any) {
    return body;
  }

  @Patch(':id')
  updateTask(@Param('id') id, @Body() body) {
    return { id, ...body };
  }

  @Delete(':id')
  deleteTask(@Param('id') id) {
    return { id, message: 'hej obrisano' };
  }
}
