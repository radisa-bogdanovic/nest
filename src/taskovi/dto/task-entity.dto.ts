import { ApiProperty } from '@nestjs/swagger';

export class TaskEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'test' })
  name!: string;

  @ApiProperty({ example: 'Srednji', enum: ['Mali', 'Srednji', 'veliki'] })
  prioritet!: string;

  @ApiProperty({ example: 'Ovo je opus' })
  opis!: number;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
