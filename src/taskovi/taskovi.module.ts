import { Module } from '@nestjs/common';
import { TaskoviController } from './taskovi.controller';
import { TaskoviService } from './taskovi.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskoviController],
  providers: [TaskoviService],
})
export class TaskoviModule {}
