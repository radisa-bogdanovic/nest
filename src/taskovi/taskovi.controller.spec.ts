import { Test, TestingModule } from '@nestjs/testing';
import { TaskoviController } from './taskovi.controller';

describe('TaskoviController', () => {
  let controller: TaskoviController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskoviController],
    }).compile();

    controller = module.get<TaskoviController>(TaskoviController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
