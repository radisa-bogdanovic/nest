import { PrismaService } from '../prisma/prisma.service';
import { NotesService } from './notes.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  mockPrisma,
  mockUser1,
  mockUser2,
  userId,
  titleMock,
} from '../utils/testMockData';

describe('Notes tests', () => {
  let service: NotesService;
  let prisma: PrismaService;
  let module: TestingModule;

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
    mockPrisma.note.findMany.mockResolvedValue([mockUser1, mockUser2]);
    const result = await service.findAll(userId);
    expect(result).toEqual([mockUser1, mockUser2]);
  });

  it('Trebalo bi da vrati notes ako postoji', async () => {
    mockPrisma.note.findUnique.mockResolvedValue(mockUser1);

    const result = await service.findOne(1, userId);
    expect(result).toEqual(mockUser1);
  });

  it('Trebalo bi da pukne error ako notes ne postoji', async () => {
    mockPrisma.note.findUnique.mockResolvedValue(null);
    await expect(service.findOne(1, userId)).rejects.toThrow(NotFoundException);
  });

  it('Trebalo bi da napravi notes', async () => {
    mockPrisma.note.create.mockResolvedValueOnce({
      id: 1,
      ...titleMock,
    });

    const result = await service.create(titleMock as any, userId);

    expect(result).toEqual({
      id: 1,
      ...titleMock,
    });

    expect(prisma.note.create).toHaveBeenCalledWith({
      data: {
        ...titleMock,
        user: {
          connect: { id: userId },
        },
      },
    });
  });

  it('Trebalo bi da azurira notes', async () => {
    mockPrisma.note.update.mockResolvedValueOnce({
      id: 1,
      ...titleMock,
    });

    const result = await service.update(titleMock as any, 1 as any, userId);

    expect(result).toEqual({
      id: 1,
      ...titleMock,
    });
  });

  it('Trebalo bi da pukne kod update ako notes ne postoji', async () => {
    mockPrisma.note.update.mockRejectedValue({ code: 'P2025' });
    await expect(service.update({} as any, 999 as any, userId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Trebalo bi da obrise note', async () => {
    mockPrisma.note.delete.mockResolvedValue(mockUser1);

    const result = await service.remove(1, userId);

    expect(result).toEqual(mockUser1);
  });

  it('Trebalo bi da pukne error ako task ne postoji u bazi tokom brisanja', async () => {
    mockPrisma.note.delete.mockRejectedValue({ code: 'P2025' });
    await expect(service.remove(999, userId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
