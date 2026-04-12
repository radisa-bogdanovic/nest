import { Injectable, NotFoundException } from '@nestjs/common';
import { NapraviTaskDto } from './dto/napravi-task.dto';
import { AzurirajTaskDto } from './dto/azuriraj-task.dto';
import { Prioritet } from './dto/prioritet.dto';
import { FindSpecificTasks } from './dto/find-specific-tasks.dto';

class TasksInit extends NapraviTaskDto {
  id!: number;
}

@Injectable()
export class TaskoviService {
  private tasks: TasksInit[] = [
    {
      id: 1,
      name: 'task1',
      prioritet: Prioritet.Mali,
      opis: 'Obican opis',
      kreator: 'tictac992@gmail.com',
    },
    {
      id: 2,
      name: 'task2',
      prioritet: Prioritet.Srednji,
      opis: 'Obican opis',
      kreator: 'tictac992@gmail.com',
    },
    {
      id: 3,
      name: 'task3',
      prioritet: Prioritet.Mali,
      opis: 'Obican opis',
      kreator: 'tictac992@gmail.com',
    },
    {
      id: 4,
      name: 'task4',
      prioritet: Prioritet.Veliki,
      opis: 'Obican opis',
      kreator: 'tictac992@gmail.com',
    },
    {
      id: 5,
      name: 'task5',
      prioritet: Prioritet.Veliki,
      opis: 'Obican opis',
      kreator: 'tictac992@gmail.com',
    },
    {
      id: 6,
      name: 'task6',
      prioritet: Prioritet.Mali,
      opis: 'Obican opis',
      kreator: 'test@gmail.com',
    },
    {
      id: 7,
      name: 'task7',
      prioritet: Prioritet.Srednji,
      opis: 'Obican opis',
      kreator: 'test@gmail.com',
    },
  ];

  getTasks(querry: FindSpecificTasks) {
    if (querry.prioritet) {
      return this.tasks.filter(
        (task: TasksInit) => task.prioritet === querry.prioritet,
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
    const affectedTask = this.getTask(id);
    this.tasks = this.tasks.map((task: TasksInit) => {
      if (task.id === id) {
        return { ...task, ...body };
      }
      return task;
    });
    return affectedTask;
  }

  delete(id: number) {
    const affectedTask = this.getTask(id);
    this.tasks = this.tasks.filter((task: TasksInit) => task.id !== id);
    return { message: 'Task je obrisan', deletedTask: affectedTask };
  }
}
