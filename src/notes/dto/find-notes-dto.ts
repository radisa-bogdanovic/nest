import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';

export enum NoteSortBy {
  title = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class FindNotesDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: NoteSortBy,
    default: NoteSortBy.CREATED_AT,
    description: 'Polje po kome se sortira',
  })
  @IsIn(Object.values(NoteSortBy), {
    message: 'Sort by polje nije dozvoljeno',
  })
  @IsOptional()
  sortBy: NoteSortBy = NoteSortBy.CREATED_AT;
}
