import { TestingModule } from '@nestjs/testing';
import { TaskoviService } from './taskovi.service';
import { PrismaService } from '../prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { Prioritet } from './dto/prioritet.dto';
import { NotFoundException } from '@nestjs/common';

describe('Taskovi service test', () => {
  let service: TaskoviService;
  let prisma: PrismaService;

  const mockPrisma = {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

  ///get test i get tests

  it('Trebalo bi da vrati sve taskove ako nema querry', async () => {
    mockPrisma.task.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await service.getTasks({});

    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: {},
    });
  });

  it('Trebalo bi da filtrira po prioritetu i da vrati sve sa tim priopritetom', async () => {
    mockPrisma.task.findMany.mockResolvedValue([
      { id: 1, prioritet: Prioritet.Veliki },
      { id: 2, prioritet: Prioritet.Veliki },
    ]);

    const result = await service.getTasks({
      prioritet: Prioritet.Veliki,
    });

    expect(result).toEqual([
      { id: 1, prioritet: Prioritet.Veliki },
      { id: 2, prioritet: Prioritet.Veliki },
    ]);

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: { prioritet: Prioritet.Veliki },
    });
  });

  it('Trebalo bi da vrati task ako postoji', async () => {
    mockPrisma.task.findUnique.mockResolvedValue({ id: 1 });

    const result = await service.getTask(1);
    expect(result).toEqual({ id: 1 });
  });

  it('Trebalo bi da pukne error ako task ne postoji', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(null);
    await expect(service.getTask(1)).rejects.toThrow(NotFoundException);
  });

  //napravi test

  it('Trebalo bi da napravi task', async () => {
    const taskData = { ime: 'test ime' };
    mockPrisma.task.create.mockResolvedValueOnce({
      id: 1,
      ...taskData,
    });

    const result = await service.createTask(taskData as any);

    expect(result).toEqual({
      id: 1,
      ...taskData,
    });

    expect(prisma.task.create).toHaveBeenCalledWith({ data: taskData });
  });

  //azuriraj task

  it('Trebalo bi da azurira task', async () => {
    const taskData = { ime: 'Azurirane' };
    mockPrisma.task.update.mockResolvedValueOnce({
      id: 1,
      ...taskData,
    });

    const result = await service.updateTask(taskData as any, 1);

    expect(result).toEqual({
      id: 1,
      ...taskData,
    });
  });

  it('Trebalo bi da pukne kod update ako task ne postoji', async () => {
    mockPrisma.task.update.mockRejectedValue({ code: 'P2025' });
    await expect(service.updateTask({} as any, 999)).rejects.toThrow(
      NotFoundException,
    );
  });

  // Delete

  it('Trebalo bi da obrise task', async () => {
    mockPrisma.task.delete.mockResolvedValue({ id: 1 });

    const result = await service.delete(1);

    expect(result).toEqual({ id: 1 });
  });

  it('Trebalo bi da pukne error ako task ne postoji u bazi tokom brisanja', async () => {
    mockPrisma.task.delete.mockRejectedValue({ code: 'P2025' });
    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
  });
});

//it('', async () => {});
