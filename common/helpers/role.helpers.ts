import { UnauthorizedException } from '@nestjs/common';
import { Role } from '../enums/role.enums';

export const conditionData = (req: any, prioritet?: string) => {
  const { userId, role } = req?.user ?? {};

  if (userId == null) {
    throw new UnauthorizedException('Niste ulogovani');
  }

  const prioritetQuerry = prioritet ? { prioritet } : {};

  return role === Role.ADMIN
    ? { ...prioritetQuerry }
    : { ...prioritetQuerry, userId };
};
