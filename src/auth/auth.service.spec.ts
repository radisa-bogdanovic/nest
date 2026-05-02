import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockJwt = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= REGISTER =================
  describe('register', () => {
    it('Trebalo bi da registruje korisnika', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });

      const result = await service.register({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result).toEqual({
        message: 'Uspesna registracija',
        user: {
          id: 1,
          email: 'test@test.com',
        },
      });
    });

    it('Treba da pukne ako korisnik postoji', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(
        service.register({
          email: 'test@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ================= LOGIN =================
  describe('login', () => {
    it('Trebalo bi uspesno da se uloguje', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'hashed',
        role: 'USER',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockJwt.signAsync
        .mockResolvedValueOnce('accessToken')
        .mockResolvedValueOnce('refreshToken');

      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.login({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });

    it('Treba da pukne ako korisnik ne postoji', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'test@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Treba da pukne ako je sifra pogresna', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        password: 'hashed',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ================= REFRESH =================
  describe('refreshToken', () => {
    it('trebalo bi da refresha token', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        role: 'USER',
        refreshToken: 'hashedToken',
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);

      jest.spyOn(service, 'getTokens').mockResolvedValue({
        accessToken: 'newAccess',
        refreshToken: 'newRefresh',
      });

      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();

      jest
        .spyOn(require('./helpers/createHash'), 'hashToken')
        .mockReturnValue('hashedToken');

      const result = await service.refreshToken(1, 'plainToken');

      expect(result).toEqual({
        accessToken: 'newAccess',
        refreshToken: 'newRefresh',
      });
    });

    it('Trebalo ib da pukne ako nije token ok', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        refreshToken: 'hashedToken',
      });

      jest
        .spyOn(require('./helpers/createHash'), 'hashToken')
        .mockReturnValue('wrong');

      await expect(service.refreshToken(1, 'bad')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ================= LOGOUT =================
  describe('logout', () => {
    it('Trebalo bi da se izloguje i da obrise refreshToken', async () => {
      mockPrisma.user.update.mockResolvedValue({});

      await service.logout(1);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { refreshToken: null },
      });
    });
  });

  // ================= FIND ONE =================
  describe('pronadji korisnika', () => {
    it('Trebalo bi da vrati korisnika', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('Treba da pukne ako ne pronadje', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ================= REMOVE =================
  describe('remove', () => {
    it('trebalo bi da obrisemo korisnika', async () => {
      mockPrisma.user.delete.mockResolvedValue({ id: 2 });

      const result = await service.remove(2, {
        user: { userId: 1 },
      });

      expect(result).toEqual({ id: 2 });
    });

    it('ne bi trebalo da obrisemo sebe', async () => {
      await expect(service.remove(1, { user: { userId: 1 } })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
