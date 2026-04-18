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
import { FindSpecificTasks } from './dto/find-specific-tasks.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('taskovi')
export class TaskoviController {
  constructor(private readonly taskService: TaskoviService) {}

  @Get('svi-taskovi')
  getTasks(@Query() prioritet: FindSpecificTasks) {
    return this.taskService.getTasks(prioritet);
  }
  @Throttle({ default: { limit: 5, ttl: 60000 } })
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
