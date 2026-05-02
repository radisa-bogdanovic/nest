import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    example: 'Note 1',
    description: 'Ovo je naziv notesa',
  })
  @IsString({ message: 'Title mora biti u tekstualnom formatu' })
  @IsNotEmpty({ message: 'Title mora sadrzati neku vrednost!' })
  title!: string;
  @ApiProperty({
    example: 'bla bla bla',
    description: 'Ovo je opis notesa',
  })
  @IsString({ message: 'Opis mora biti u tekstualnom formatu' })
  @IsNotEmpty({ message: 'Opis mora sadrzati neku vrednost!' })
  description!: string;
}
