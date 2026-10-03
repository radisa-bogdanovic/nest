import { PartialType } from '@nestjs/mapped-types';
import { PrioritetDTO } from './prioritet.dto';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';

export class FindSpecificTasksDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(PrioritetDTO),
) {}
