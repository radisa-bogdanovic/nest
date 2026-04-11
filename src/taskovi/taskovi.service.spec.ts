import { Test, TestingModule } from '@nestjs/testing';
import { TaskoviService } from './taskovi.service';

describe('TaskoviService', () => {
  let service: TaskoviService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskoviService],
    }).compile();

    service = module.get<TaskoviService>(TaskoviService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
