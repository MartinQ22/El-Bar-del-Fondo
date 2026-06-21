import bcrypt from 'bcrypt';

import { userModel } from '../models/usersModel.js';
import { logger } from '../utils/logger.utils.js';

const initialUsers = [
  {
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@coder.com',
    age: 30,
    password: 'admin123',
    role: 'admin',
  },
  {
    first_name: 'Regular',
    last_name: 'User',
    email: 'user@ejemplo.com',
    age: 25,
    password: 'user123',
    role: 'user',
  },
];

export async function seedUsers() {
  const usersCount = await userModel.estimatedDocumentCount();

  if (usersCount > 0) {
    logger.info({
      msg: 'Users seed skipped',
      reason: 'Users already exist',
    });

    return;
  }

  const usersToCreate = await Promise.all(
    initialUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      return {
        ...user,
        password: hashedPassword,
      };
    })
  );

  await userModel.insertMany(usersToCreate);

  logger.info({
    msg: 'Users seed completed',
    users: initialUsers.map((user) => ({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    })),
  });
}