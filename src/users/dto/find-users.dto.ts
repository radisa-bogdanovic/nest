import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Role } from 'common/enums/role.enums';
import { PaginationQueryDto } from 'common/pagination/pagination-query.dto';

export class FindUsersDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: Role, description: 'Filter po roli' })
  @IsOptional()
  @IsEnum(Role, { message: 'Rola mora biti USER ili ADMIN' })
  role?: Role; //<---- Svi dekoratori iznad se odnose na ovaj par key-value
}
