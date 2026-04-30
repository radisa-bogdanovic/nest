import { Injectable, NotFoundException } from '@nestjs/common';
import { NapraviTaskDto } from './dto/napravi-task.dto';
import { AzurirajTaskDto } from './dto/azuriraj-task.dto';
import { FindSpecificTasks } from './dto/find-specific-tasks.dto';
import { PrismaService } from '../prisma/prisma.service';

import { conditionData } from '../../common/helpers/role.helpers';

@Injectable()
export class TaskoviService {
  constructor(private prisma: PrismaService) {}

  async getTasks(querry: FindSpecificTasks, req: any) {
    const condition = conditionData(req);

    return this.prisma.task.findMany({
      //findMany pronadji sve ili sa odredjenom kondicijom
      where: condition,
      //where predstavlja kondiciju. Ako posaljemo {} vraca sve. Ako postavimo prioritet(key):querry.prioritet(vradnost)
    });
  }

  async getTask(id: number, req: any) {
    const condition = conditionData(req);
    const task = await this.prisma.task.findUnique({
      where: { id, ...condition },
      // {id} isto sto i {id:id}
      //findUnique pronalazi jedinstven eleemnt
    });

    if (!task) {
      //ako ne postoji u bazi vrati null pa zato ovde gledamo da li postoji ili ne
      throw new NotFoundException(`Element sa id:${id} nije pronadjen`);
    }
    return task;
  }

  async createTask(body: NapraviTaskDto, req: any) {
    return await this.prisma.task.create({
      data: {
        ...body,
        user: {
          connect: { id: req.user.userId },
        },
      },
    });
    //Create je metoda za pravljenje neke stvari. Ona ocekuje u data da se prosledi data/body
  }

  async updateTask(body: AzurirajTaskDto, id: number, req: any) {
    const condition = conditionData(req);
    try {
      return await this.prisma.task.update({
        where: { id, ...condition },
        data: body,
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
    //ako koristimo updateMany error nece biti trowan nego ce vratiti count:0 i mozemo da gledamo updated.count ===0 kao izvor istine da puknemo error
    // a updated bi bilo tipa const updated = await thi.prisma.task.updateMany(... ostalo je sve isto kao i za updaet
  }

  async delete(id: number, req: any) {
    const condition = conditionData(req);
    try {
      return await this.prisma.task.delete({
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
