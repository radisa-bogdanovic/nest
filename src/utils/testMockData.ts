export const userId = 1;
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

export const mockPrisma = {
  task: methods,
  note: methods,
};

export const titleMock = { title: 'test ime', userId: 1 };
