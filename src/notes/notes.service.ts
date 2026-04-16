import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: createNoteDto,
    });
  }

  async findAll() {
    return this.prisma.note.findMany();
  }

  async findOne(id: number) {
    const notes = await this.prisma.note.findUnique({
      where: { id },
      // {id} isto sto i {id:id}
      //findUnique pronalazi jedinstven eleemnt
    });

    if (!notes) {
      //ako ne postoji u bazi vrati null pa zato ovde gledamo da li postoji ili ne
      throw new NotFoundException(`Element sa id:${id} nije pronadjen`);
    }
    return notes;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    try {
      return await this.prisma.note.update({
        where: { id },
        data: updateNoteDto,
      });
    } catch (error: any) {
      //ovde vrati error body i zato radimo sa try/catch
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Hej, element sa id:${id} ne postoji u bazi!`,
        );
      } else {
        throw new Error();
      }
    }
    //update azurira, where gleda koji item (id) da odabere a data predstavlja updated body. I sa ovom metodom se azuira updatedAt time
  }

  async remove(id: number) {
    try {
      return await this.prisma.note.delete({
        where: { id },
      });
    } catch (error: any) {
      //ovde vrati error body i zato radimo sa try/catch
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Hej, element sa id:${id} ne postoji u bazi!`,
        );
      } else {
        throw new Error();
      }
    }
    //delete brise glidajuci po id
  }
}
