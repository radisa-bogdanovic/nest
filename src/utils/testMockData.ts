import { Role } from '../../common/enums/role.enums';
import { conditionData } from '../../common/helpers/role.helpers';

export const userId = 1;
export const reqUser = {
  user: {
    userId: 1,
    role: Role.USER,
  },
};
export const reqAdmin = {
  userId: 2,
  role: Role.ADMIN,
};
export const mockUser1 = {
  id: 1,
  userId: 1,
};
export const mockUser2 = {
  id: 1,
  userId: 1,
};

const methods = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
export const mockJwt = {
  signAsync: jest.fn(),
};

export const mockPrisma = {
  task: methods,
  note: methods,
  user: methods,
};

export const mockAuthUser = {
  id: 1,
  email: 'test@test.com',
};
export const mockAuthUser2 = {
  id: 2,
  email: 'test2@test.com',
};

export const titleMock = { title: 'test ime', userId: 1 };

export const userCondition = conditionData(reqUser);
export const adminCondition = conditionData(reqAdmin);
