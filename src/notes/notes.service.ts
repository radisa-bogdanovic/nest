import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.note.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const notes = await this.prisma.note.findUnique({
      where: { id, userId },
      // {id} isto sto i {id:id}
      //findUnique pronalazi jedinstven eleemnt
    });

    if (!notes) {
      //ako ne postoji u bazi vrati null pa zato ovde gledamo da li postoji ili ne
      throw new NotFoundException(`Element sa id:${id} nije pronadjen`);
    }
    return notes;
  }
  async create(createNoteDto: CreateNoteDto, userId: number) {
    return this.prisma.note.create({
      data: {
        ...createNoteDto,
        user: {
          connect: { id: userId },
        },
      },
    });
  }
  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    try {
      return await this.prisma.note.update({
        where: { id, userId },
        data: updateNoteDto,
      });
    } catch (error: any) {
      //ovde vrati error body i zato radimo sa try/catch
      if (error.code === 'P2025') {
        throw new NotFoundException(`Hej, element sa id:${id} nije pronadjen!`);
      } else {
        throw new Error();
      }
    }
    //update azurira, where gleda koji item (id) da odabere a data predstavlja updated body. I sa ovom metodom se azuira updatedAt time
  }

  async remove(id: number, userId: number) {
    try {
      return await this.prisma.note.delete({
        where: { id, userId },
      });
    } catch (error: any) {
      //ovde vrati error body i zato radimo sa try/catch
      if (error.code === 'P2025') {
        throw new NotFoundException(`Hej, element sa id:${id} nije pronadjen!`);
      } else {
        throw new Error();
      }
    }
    //delete brise glidajuci po id
  }
}
