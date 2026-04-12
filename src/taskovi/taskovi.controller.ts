import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { TaskoviService } from './taskovi.service';
import { ParseIntPipe } from '@nestjs/common';
import { NapraviTaskDto } from './dto/napravi-task.dto';
import { AzurirajTaskDto } from './dto/azuriraj-task.dto';

@Controller('taskovi')
export class TaskoviController {
  constructor(private readonly taskService: TaskoviService) {}

  @Get('svi-taskovi')
  getTasks(@Query('prioritet') prioritet) {
    return this.taskService.getTasks(prioritet);
  }

  @Get(':id')
  getTask(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory() {
          return new BadRequestException('Id mora biti broj');
        },
      }),
    ) // primer sa specificnom porukom
    id: number,
  ) {
    return this.taskService.getTask(id);
  }

  @Post('napravi')
  createTask(@Body() body: NapraviTaskDto) {
    return this.taskService.createTask(body);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AzurirajTaskDto,
  ) {
    return this.taskService.updateTask(body, id);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.delete(id);
  }
}
