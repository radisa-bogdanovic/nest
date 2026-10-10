import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Role } from 'common/enums/role.enums';

export class UpdateUsersDto {
  @ApiPropertyOptional({
    enum: Role,
    description: 'Promena role promote/demote',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Rola mora biti USER ili ADMIN' })
  role?: Role; //<---- Svi dekoratori iznad se odnose na ovaj par key-value
}
