import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskoviService {
  private tasks = [
    { id: 1, name: 'task1', prioritet: 'Mali', opis: 'Obican opis' },
    { id: 2, name: 'task2', prioritet: 'Srednji', opis: 'Obican opis' },
    { id: 3, name: 'task3', prioritet: 'Mali', opis: 'Obican opis' },
    { id: 4, name: 'task4', prioritet: 'Veliki', opis: 'Obican opis' },
    { id: 5, name: 'task5', prioritet: 'Veliki', opis: 'Obican opis' },
    { id: 6, name: 'task6', prioritet: 'Mali', opis: 'Obican opis' },
    { id: 7, name: 'task 7', prioritet: 'Srednji', opis: 'Obican opis' },
  ];

  getTasks(prioritet: string) {
    if (prioritet) {
      return this.tasks.filter((task) => task.prioritet === prioritet);
    }
    return this.tasks;
  }

  getTask(id: number) {
    return this.tasks.find((task) => task.id === +id);
  }

  createTask(body: any) {
    const newId = this.tasks.length + 1;
    const newTask = { id: newId, ...body };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(body: any, id: number) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        return { ...task, ...body };
      }
      return task;
    });
    return this.getTask(id);
  }

  delete(id: number) {
    const affectedTask = this.getTask(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return { message: 'Task je obrisan', deletedTask: affectedTask };
  }
}
