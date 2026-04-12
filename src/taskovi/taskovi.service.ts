import { Injectable, NotFoundException } from '@nestjs/common';
import { NapraviTaskDto, Prioritet } from './dto/napravi-task.dto';
import { AzurirajTaskDto } from './dto/azuriraj-task.dto';

class TasksInit extends NapraviTaskDto {
  id!: number;
}

@Injectable()
export class TaskoviService {
  private tasks: TasksInit[] = [
    { id: 1, name: 'task1', prioritet: Prioritet.Mali, opis: 'Obican opis' },
    { id: 2, name: 'task2', prioritet: Prioritet.Srednji, opis: 'Obican opis' },
    { id: 3, name: 'task3', prioritet: Prioritet.Mali, opis: 'Obican opis' },
    { id: 4, name: 'task4', prioritet: Prioritet.Veliki, opis: 'Obican opis' },
    { id: 5, name: 'task5', prioritet: Prioritet.Veliki, opis: 'Obican opis' },
    { id: 6, name: 'task6', prioritet: Prioritet.Mali, opis: 'Obican opis' },
    { id: 7, name: 'task7', prioritet: Prioritet.Srednji, opis: 'Obican opis' },
  ];

  getTasks(prioritet: string) {
    if (prioritet) {
      return this.tasks.filter(
        (task: TasksInit) => task.prioritet === prioritet,
      );
    }
    return this.tasks;
  }

  getTask(id: number) {
    const task = this.tasks.find((task: TasksInit) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task sa id:${id} ne postoji allooo`);
    }

    return task;
  }

  createTask(body: NapraviTaskDto) {
    const newId = this.tasks.length + 1;
    const newTask = { id: newId, ...body };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(body: AzurirajTaskDto, id: number) {
    this.tasks = this.tasks.map((task: TasksInit) => {
      if (task.id === id) {
        return { ...task, ...body };
      }
      return task;
    });
    return this.getTask(id);
  }

  delete(id: number) {
    const affectedTask = this.getTask(id);
    this.tasks = this.tasks.filter((task: TasksInit) => task.id !== id);
    return { message: 'Task je obrisan', deletedTask: affectedTask };
  }
}
