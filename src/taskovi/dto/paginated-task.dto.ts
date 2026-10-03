import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from './task-entity.dto';
import { PageMetaDto } from 'common/pagination/page-meta.dto';

export class PaginatedTaskDto {
  @ApiProperty({
    type: [TaskEntity],
    description: 'Taskovi sa trenutne strane',
  })
  data!: TaskEntity[];

  @ApiProperty({
    type: PageMetaDto,
  })
  meta!: PageMetaDto;
}
