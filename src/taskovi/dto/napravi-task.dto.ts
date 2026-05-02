import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PrioritetDTO } from './prioritet.dto';
import { ApiProperty } from '@nestjs/swagger';

export class NapraviTaskDto extends PrioritetDTO {
  @ApiProperty({
    example: 'Task 1',
    description: 'Ovo je naziv taska',
  })
  @IsString({ message: 'Ime mora biti u tekstualnom formatu' })
  @IsNotEmpty({ message: 'Ime mora sadrzati neku vrednost!' })
  name!: string;

  @ApiProperty({
    example: 'Bla bla bla',
    description: 'Ovo je opis taska',
  })
  @IsString()
  @IsOptional()
  opis?: string;
}
