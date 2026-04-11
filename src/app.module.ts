import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskoviModule } from './taskovi/taskovi.module';

@Module({
  imports: [TaskoviModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
