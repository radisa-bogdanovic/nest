import { Role } from '../enums/role.enums';

export const conditionData = (req: any, prioritet?: string) => {
  const prioritetQuerry = prioritet ? { prioritet } : {};
  const { userId, role } = req?.user ?? {};
  return role === Role.ADMIN
    ? { ...prioritetQuerry }
    : { ...prioritetQuerry, userId };
};
