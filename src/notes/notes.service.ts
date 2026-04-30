import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../prisma/prisma.service';
import { conditionData } from '../../common/helpers/role.helpers';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findAll(req: any) {
    const { prioritet, ...notesCondition } = conditionData(req);
    return this.prisma.note.findMany({ where: notesCondition });
  }

  async findOne(id: number, req: any) {
    const condition = conditionData(req);
    const notes = await this.prisma.note.findUnique({
      where: { id, ...condition },
      // {id} isto sto i {id:id}
      //findUnique pronalazi jedinstven eleemnt
    });

    if (!notes) {
      //ako ne postoji u bazi vrati null pa zato ovde gledamo da li postoji ili ne
      throw new NotFoundException(`Element sa id:${id} nije pronadjen`);
    }
    return notes;
  }
  async create(createNoteDto: CreateNoteDto, req: any) {
    return this.prisma.note.create({
      data: {
        ...createNoteDto,
        user: {
          connect: { id: req.user.userId },
        },
      },
    });
  }
  async update(id: number, updateNoteDto: UpdateNoteDto, req: any) {
    const condition = conditionData(req);
    try {
      return await this.prisma.note.update({
        where: { id, ...condition }, // where: {id:id, userId:userID} <== azuraj note koji ima specifican id i samo ako je vlasnik user sa userId
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

  async remove(id: number, req: any) {
    const condition = conditionData(req);
    try {
      return await this.prisma.note.delete({
        where: { id, ...condition },
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
