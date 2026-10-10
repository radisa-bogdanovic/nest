import { ApiProperty } from '@nestjs/swagger';

export class NotesEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'test' })
  title!: string;

  @ApiProperty({ example: 'Ovo je opus' })
  description!: number;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
