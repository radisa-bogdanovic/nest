import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from 'common/pagination/page-meta.dto';
import { NotesEntity } from './notes-entity';

export class PaginatedNotesDTo {
  @ApiProperty({
    type: [NotesEntity],
    description: 'Taskovi sa trenutne strane',
  })
  data!: NotesEntity[];

  @ApiProperty({
    type: PageMetaDto,
  })
  meta!: PageMetaDto;
}
