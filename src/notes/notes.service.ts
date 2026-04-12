import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

class NoteInit extends CreateNoteDto {
  id!: number;
}

@Injectable()
export class NotesService {
  private notes: NoteInit[] = [
    {
      description: 'Opis',
      id: 1,
      kreator: 'tictac992@gmail.com',
      title: 'prvi notes',
    },
    {
      description: 'Opis',
      id: 2,
      kreator: 'tictac992@gmail.com',
      title: 'Drugi notes',
    },
    {
      description: 'Opis',
      id: 3,
      kreator: 'tictac992@gmail.com',
      title: 'Tester notes',
    },
  ];

  create(createNoteDto: CreateNoteDto) {
    const newId = this.notes.length + 1;
    const newNotes = { id: newId, ...createNoteDto };
    this.notes.push(newNotes);
    return newNotes;
  }

  findAll() {
    return this.notes;
  }

  findOne(id: number) {
    const note = this.notes.find((note: NoteInit) => note.id === id);

    if (!note) {
      throw new NotFoundException(`Note sa id:${id} ne postoji allooo`);
    }

    return note;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    const affectedNote = this.findOne(id);
    this.notes = this.notes.map((note: NoteInit) => {
      if (note.id === id) {
        return { ...note, ...updateNoteDto };
      }
      return note;
    });
    return affectedNote;
  }

  remove(id: number) {
    const affectedNote = this.findOne(id);
    this.notes = this.notes.filter((task: NoteInit) => task.id !== id);
    return { message: 'Task je obrisan', deletedTask: affectedNote };
  }
}
