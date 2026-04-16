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
    const task = this.prisma.task.findUnique({
      where: { id },
      // {id} isto sto i {id:id}
      //findUnique pronalazi jedinstven eleemnt
    });

    if (!task) {
      throw new NotFoundException('Ne radi alo');
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
    return this.prisma.task.update({
      where: { id },
      data: body,
    });

    //update azurira, where gleda koji item (id) da odabere a data predstavlja updated body. I sa ovom metodom se azuira updatedAt time
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
    //delete brise glidajuci po id
  }
}
