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
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskoviService } from './taskovi.service';
import { ParseIntPipe } from '@nestjs/common';
import { NapraviTaskDto } from './dto/napravi-task.dto';
import { AzurirajTaskDto } from './dto/azuriraj-task.dto';
import { FindSpecificTasks } from './dto/find-specific-tasks.dto';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@Controller('taskovi')
export class TaskoviController {
  constructor(private readonly taskService: TaskoviService) {}

  @Get('svi-taskovi')
  getTasks(@Query() prioritet: FindSpecificTasks, @Req() req: any) {
    return this.taskService.getTasks(prioritet, req);
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
    @Req()
    req: any,
  ) {
    return this.taskService.getTask(id, req);
  }

  @Post('napravi')
  createTask(@Body() body: NapraviTaskDto, @Req() req: any) {
    return this.taskService.createTask(body, req);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AzurirajTaskDto,
    @Req() req: any,
  ) {
    return this.taskService.updateTask(body, id, req);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.taskService.delete(id, req);
  }
}
