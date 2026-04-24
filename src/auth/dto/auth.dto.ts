import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthValidatorDto {
  @IsEmail({}, { message: 'Email mora biti validan!' })
  email!: string;
  @IsNotEmpty({ message: 'Password je obavezan' })
  @MinLength(6, { message: 'Password mora imati barem 6 karaktera' })
  password!: string;
}
