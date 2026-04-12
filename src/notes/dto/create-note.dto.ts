import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateNoteDto {
  @IsString({ message: 'Title mora biti u tekstualnom formatu' })
  @IsNotEmpty({ message: 'Title mora sadrzati neku vrednost!' })
  title!: string;

  @IsString({ message: 'Opis mora biti u tekstualnom formatu' })
  @IsNotEmpty({ message: 'Opis mora sadrzati neku vrednost!' })
  description!: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Kretor mora sadrzati neku vrednost!' })
  kreator!: string;
}
