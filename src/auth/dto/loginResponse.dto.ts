import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGljdGFjOTkyQGdtYWlsLmNvbSIsImlhdCI6MTc3NzIxMzY5OSwiZXhwIjoxNzc3MjE0NTk5fQ.RmPnIhkZMEzewDLqsu7CASwQahMdCrJvI8B5787o0i4',
  })
  accessToken!: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoidGljdGFjOTkyQGdtYWlsLmNvbSIsImlhdCI6MTc3NzIxMzY5OSwiZXhwIjoxNzc3ODE4NDk5fQ.TLdEkRkA14Yle7x8AhTgK_5pXzUUf2SXmucgweDRAp4',
  })
  refreshToken!: string;
}
