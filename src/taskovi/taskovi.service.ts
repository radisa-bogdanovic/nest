import { Injectable, NotFoundException } from '@nestjs/common';
import { NapraviTaskDto } from './dto/napravi-task.dto';
import { AzurirajTaskDto } from './dto/azuriraj-task.dto';
import { FindSpecificTasks } from './dto/find-specific-tasks.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskoviService {
  constructor(private prisma: PrismaService) {}

  async getTasks(querry: FindSpecificTasks) {
    return this.prisma.task.findMany({
      //findMany pronadji sve ili sa odredjenom kondicijom
      where: querry.prioritet ? { prioritet: querry.prioritet } : {},
      //where predstavlja kondiciju. Ako posaljemo {} vraca sve. Ako postavimo prioritet(key):querry.prioritet(vradnost)
    });
  }

  async getTask(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      // {id} isto sto i {id:id}
      //findUnique pronalazi jedinstven eleemnt
    });

    if (!task) {
      //ako ne postoji u bazi vrati null pa zato ovde gledamo da li postoji ili ne
      throw new NotFoundException(`Element sa id:${id} nije pronadjen`);
    }
    return task;
  }

  async createTask(body: NapraviTaskDto) {
    return await this.prisma.task.create({
      data: body,
    });
    //Create je metoda za pravljenje neke stvari. Ona ocekuje u data da se prosledi data/body
  }

  async updateTask(body: AzurirajTaskDto, id: number) {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: body,
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

  async delete(id: number) {
    try {
      return await this.prisma.task.delete({
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
