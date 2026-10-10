import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty({
    example: 132,
  })
  total!: number;

  @ApiProperty({
    example: 1,
  })
  page!: number;
  @ApiProperty({
    example: 20,
  })
  limit!: number;

  @ApiProperty({
    example: 5,
  })
  totalPages!: number;

  @ApiProperty({
    example: true,
  })
  hasHextPage!: boolean;

  @ApiProperty({
    example: false,
  })
  hasPrevPage!: boolean;
}
