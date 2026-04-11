import { Module } from '@nestjs/common';
import { TaskoviController } from './taskovi.controller';
import { TaskoviService } from './taskovi.service';

@Module({
  imports: [],
  controllers: [TaskoviController],
  providers: [TaskoviService],
})
export class TaskoviModule {}
