import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindUsersDto } from './dto/find-users.dto';
import {
  buildPage,
  buildPagination,
} from 'common/pagination/pagination.helper';
import { Prisma } from '@prisma/client';
import { UpdateUsersDto } from './dto/update-user.dto';
import { Role } from 'common/enums/role.enums';
import { error } from 'console';

const USER_PUBLIC_DATA = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindUsersDto) {
    const p = buildPagination(query);

    const where = query.role && { role: query.role };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: p.skip,
        take: p.take,
        select: USER_PUBLIC_DATA,
      }),
      this.prisma.user.count({ where }),
    ]);
    return buildPage(data, total, p);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }, // {id} => {id:id}
      select: USER_PUBLIC_DATA,
    });

    if (!user) {
      throw new NotFoundException(`Korisnik sa id:${id} nije pronadjen!??!#>`);
    }
    return user;
  }

  async update(id: number, dto: UpdateUsersDto, req: any) {
    if (id === req.user.userId) {
      throw new ConflictException('Ne mozes da demoutjes/upgradujes sam sebe');
    }

    const admins = await this.prisma.user.count({
      where: { role: Role.ADMIN },
    });
    const target = await this.prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (target?.role === Role.ADMIN && admins <= 1) {
      throw new ConflictException('Ne mozes da demotujes poslednjeg admine');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: dto,
        select: USER_PUBLIC_DATA,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Korisnik sa id:${id} nije pronadjen!??!#>`,
        );
      }
      throw error;
    }
  }

  async remove(id: number, req: any) {
    if (id === req.user.userId) {
      throw new ConflictException('Ne mozes da obrises sam sebe covece?');
    }

    try {
      return await this.prisma.user.delete({
        where: { id },
        select: USER_PUBLIC_DATA,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Korisnik sa id:${id} nije pronadjen!??!#>`,
        );
      }
      throw error;
    }
  }
}
