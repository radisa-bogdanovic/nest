import { PrismaService } from '../prisma/prisma.service';
import { NotesService } from './notes.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

describe('Notes tests', () => {
  let service: NotesService;
  let prisma: PrismaService;
  let module: TestingModule;

  const mockPrisma = {
    note: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();
    service = module.get<NotesService>(NotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    module.close();
  });

  it('Trebalo bi da vrati listu notes', async () => {
    mockPrisma.note.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('Trebalo bi da vrati notes ako postoji', async () => {
    mockPrisma.note.findUnique.mockResolvedValue({ id: 1 });

    const result = await service.findOne(1);
    expect(result).toEqual({ id: 1 });
  });

  it('Trebalo bi da pukne error ako notes ne postoji', async () => {
    mockPrisma.note.findUnique.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('Trebalo bi da napravi notes', async () => {
    const notesData = { name: 'test ime' };
    mockPrisma.note.create.mockResolvedValueOnce({
      id: 1,
      ...notesData,
    });

    const result = await service.create(notesData as any);

    expect(result).toEqual({
      id: 1,
      ...notesData,
    });

    expect(prisma.note.create).toHaveBeenCalledWith({ data: notesData });
  });

  it('Trebalo bi da azurira notes', async () => {
    const taskData = { ime: 'Azurirane' };
    mockPrisma.note.update.mockResolvedValueOnce({
      id: 1,
      ...taskData,
    });

    const result = await service.update(taskData as any, 1 as any);

    expect(result).toEqual({
      id: 1,
      ...taskData,
    });
  });

  it('Trebalo bi da pukne kod update ako notes ne postoji', async () => {
    mockPrisma.note.update.mockRejectedValue({ code: 'P2025' });
    await expect(service.update({} as any, 999 as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Trebalo bi da obrise note', async () => {
    mockPrisma.note.delete.mockResolvedValue({ id: 1 });

    const result = await service.remove(1);

    expect(result).toEqual({ id: 1 });
  });

  it('Trebalo bi da pukne error ako task ne postoji u bazi tokom brisanja', async () => {
    mockPrisma.note.delete.mockRejectedValue({ code: 'P2025' });
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
