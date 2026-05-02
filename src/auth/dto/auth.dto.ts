import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthValidatorDto {
  @ApiProperty({
    example: 'test@test.com',
    description: 'email od korisnika',
  })
  @IsEmail({}, { message: 'Email mora biti validan!' })
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'sifra od korsinika',
  })
  @IsNotEmpty({ message: 'Password je obavezan' })
  @MinLength(6, { message: 'Password mora imati barem 6 karaktera' })
  password!: string;
}
