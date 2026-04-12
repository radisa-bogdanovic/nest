import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PrioritetDTO } from './prioritet.dto';

export class NapraviTaskDto extends PrioritetDTO {
  @IsString({ message: 'Ime mora biti u tekstualnom formatu' })
  @IsNotEmpty({ message: 'Ime mora sadrzati neku vrednost!' })
  name!: string;

  @IsString()
  @IsOptional()
  opis?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Kretor mora sadrzati neku vrednost!' })
  kreator!: string;
}
