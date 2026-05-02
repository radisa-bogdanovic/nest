import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum Prioritet {
  Mali = 'Mali',
  Srednji = 'Srednji',
  Veliki = 'Veliki',
}

export class PrioritetDTO {
  @ApiProperty({
    example: Prioritet.Srednji,
    description: 'Ovo je prioritet taska',
  })
  @IsEnum(Prioritet)
  @IsNotEmpty({ message: 'Vrednost za prioritet mora postojati!' })
  prioritet!: Prioritet;
}
