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
import { TaskoviService } from './taskovi.service';

@Controller('taskovi')
export class TaskoviController {
  constructor(private readonly taskService: TaskoviService) {}

  @Get('svi-taskovi')
  getTasks(@Query('prioritet') prioritet) {
    return this.taskService.getTasks(prioritet);
  }

  @Get(':id')
  getTask(@Param('id') id) {
    return this.taskService.getTask(id);
  }

  @Post('napravi')
  createTask(@Body() body: any) {
    return this.taskService.createTask(body);
  }

  @Patch(':id')
  updateTask(@Param('id') id, @Body() body) {
    return this.taskService.updateTask(body, id);
  }

  @Delete(':id')
  deleteTask(@Param('id') id) {
    return this.taskService.delete(id);
  }
}
