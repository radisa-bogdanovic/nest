import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, isIn, IsInt, IsOptional, Min } from 'class-validator';

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 30;

export class PaginationQueryDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Broj Strane 1=>',
  })
  @Type(() => Number)
  @IsInt({ message: 'Broj stranice mora biti numericka vrednost!' })
  @Min(1, {
    message:
      'Stranica mora polaziti od broja 1, znaci brate ne moze ispod 1???',
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: MAX_LIMIT,
    default: DEFAULT_LIMIT,
    description: 'Broj elemenaata po strani (max - 30)',
  })
  @Type(() => Number)
  @IsInt({ message: 'Broj elemenata mora biti numericka vrednost!' })
  @Min(1, {
    message: 'Broj elemenata mora biti barem 1',
  })
  @IsOptional()
  limit?: number = DEFAULT_LIMIT;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsIn(['asc', 'desc'], { message: 'Sort order mora biti asc ili desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
