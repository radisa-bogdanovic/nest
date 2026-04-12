import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum Prioritet {
  Mali = 'Mali',
  Srednji = 'Srednji',
  Veliki = 'Veliki',
}

export class NapraviTaskDto {
  @IsString({ message: 'Ime mora biti u tekstualnom formatu' })
  @IsNotEmpty({ message: 'Ime mora sadrzati neku vrednost!' })
  name!: string;

  @IsEnum(Prioritet)
  @IsNotEmpty({ message: 'Prioritet mora postojati!' })
  prioritet!: Prioritet;

  @IsString()
  @IsOptional()
  opis?: string;
}
