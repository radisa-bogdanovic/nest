import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthValidatorDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { hashToken } from './helpers/createHash';
import { conditionData } from '../../common/helpers/role.helpers';
import { adminCondition } from 'src/utils/testMockData';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthValidatorDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        `Korisnik sa emailom: ${dto.email} vec postoji`,
      );
    }

    const hashedPassowrd = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassowrd,
      },
    });
    return {
      message: 'Uspesna registracija',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(dto: AuthValidatorDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Pogresan email ili password!');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Pogresan email ili password!');
    }
    const tokens = await this.getTokens(user.id, user.email, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(userId: number, email: string, role: any) {
    const payload = { sub: userId, email, jti: randomUUID(), role: role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: 'access-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: 'refresh-secret',
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = hashToken(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const isMatch = hashToken(refreshToken) === user.refreshToken;

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      //ako ne postoji u bazi vrati null pa zato ovde gledamo da li postoji ili ne
      throw new NotFoundException(`Element sa id:${id} nije pronadjen`);
    }
    return user;
  }
  // async create(createNoteDto: CreateNoteDto, req: any) {
  //   return this.prisma.note.create({
  //     data: {
  //       ...createNoteDto,
  //       user: {
  //         connect: { id: req.user.userId },
  //       },
  //     },
  //   });
  // }
  // async update(id: number, updateNoteDto: UpdateNoteDto, req: any) {
  //   const condition = conditionData(req);
  //   try {
  //     return await this.prisma.note.update({
  //       where: { id, ...condition }, // where: {id:id, userId:userID} <== azuraj note koji ima specifican id i samo ako je vlasnik user sa userId
  //       data: updateNoteDto,
  //     });
  //   } catch (error: any) {
  //     //ovde vrati error body i zato radimo sa try/catch
  //     if (error.code === 'P2025') {
  //       throw new NotFoundException(`Hej, element sa id:${id} nije pronadjen!`);
  //     } else {
  //       throw new Error();
  //     }
  //   }
  //   //update azurira, where gleda koji item (id) da odabere a data predstavlja updated body. I sa ovom metodom se azuira updatedAt time
  // }

  async remove(id: number, req: any) {
    if (id === req.user.userId) {
      throw new NotFoundException(`Ne mozes da obrises sam sebe aloo`);
    }
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      //ovde vrati error body i zato radimo sa try/catch
      if (error.code === 'P2025') {
        throw new NotFoundException(`Hej, user sa id:${id} nije pronadjen!`);
      } else {
        throw new Error();
      }
    }
    //delete brise glidajuci po id
  }
}
