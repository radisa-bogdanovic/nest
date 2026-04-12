import { IsEnum, IsNotEmpty } from 'class-validator';

export enum Prioritet {
  Mali = 'Mali',
  Srednji = 'Srednji',
  Veliki = 'Veliki',
}

export class PrioritetDTO {
  @IsEnum(Prioritet)
  @IsNotEmpty({ message: 'Vrednost za prioritet mora postojati!' })
  prioritet!: Prioritet;
}
