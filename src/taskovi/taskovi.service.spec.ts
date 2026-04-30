import { TestingModule, Test } from '@nestjs/testing';
import { TaskoviService } from './taskovi.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prioritet } from './dto/prioritet.dto';
import { NotFoundException } from '@nestjs/common';
import {
  mockPrisma,
  mockUser1,
  mockUser2,
  reqUser,
  userCondition,
} from '../utils/testMockData';

describe('Taskovi service test', () => {
  let service: TaskoviService;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        TaskoviService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<TaskoviService>(TaskoviService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await module.close();
  });
  ///get test i get tests

  it('Trebalo bi da vrati sve taskove ako nema querry', async () => {
    mockPrisma.task.findMany.mockResolvedValue([mockUser1, mockUser2]);

    const result = await service.getTasks({}, reqUser);

    expect(result).toEqual([mockUser1, mockUser2]);
    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: userCondition,
    });
  });

  it('Trebalo bi da vrati sve sa tim priopritetom', async () => {
    mockPrisma.task.findMany.mockResolvedValue([
      { id: 1, prioritet: Prioritet.Veliki, userId: 1 },
      { id: 2, prioritet: Prioritet.Veliki, userId: 1 },
    ]);

    const result = await service.getTasks(
      {
        prioritet: Prioritet.Veliki,
      },
      reqUser,
    );

    expect(result).toEqual([
      { id: 1, prioritet: Prioritet.Veliki, userId: 1 },
      { id: 2, prioritet: Prioritet.Veliki, userId: 1 },
    ]);

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: userCondition,
    });
  });

  it('Trebalo bi da vrati task ako postoji', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(mockUser1);

    const result = await service.getTask(1, reqUser);
    expect(result).toEqual(mockUser1);
  });

  it('Trebalo bi da pukne error ako task ne postoji', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(null);
    await expect(service.getTask(1, reqUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  //napravi test

  it('Trebalo bi da napravi task', async () => {
    const taskData = { ime: 'test ime' };
    mockPrisma.task.create.mockResolvedValueOnce({
      id: 1,
      ...taskData,
    });

    const result = await service.createTask(taskData as any, reqUser);

    expect(result).toEqual({
      id: 1,
      ...taskData,
    });

    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        ...taskData,
        user: {
          connect: { id: reqUser.user.userId },
        },
      },
    });
  });

  //azuriraj task

  it('Trebalo bi da azurira task', async () => {
    const taskData = { ime: 'Azurirane' };
    mockPrisma.task.update.mockResolvedValueOnce({
      id: 1,
      ...taskData,
    });

    const result = await service.updateTask(taskData as any, 1, reqUser);

    expect(result).toEqual({
      id: 1,
      ...taskData,
    });
  });

  it('Trebalo bi da pukne kod update ako task ne postoji', async () => {
    mockPrisma.task.update.mockRejectedValue({ code: 'P2025' });
    await expect(service.updateTask({} as any, 999, reqUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  // Delete

  it('Trebalo bi da obrise task', async () => {
    mockPrisma.task.delete.mockResolvedValue(mockUser1);

    const result = await service.delete(1, reqUser);

    expect(result).toEqual(mockUser1);
  });

  it('Trebalo bi da pukne error ako task ne postoji u bazi tokom brisanja', async () => {
    mockPrisma.task.delete.mockRejectedValue({ code: 'P2025' });
    await expect(service.delete(999, reqUser)).rejects.toThrow(
      NotFoundException,
    );
  });
});

//it('', async () => {});
