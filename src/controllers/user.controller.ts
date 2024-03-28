import { db } from '@/config/database';
import { userLoginSchema, userRegisterSchema } from '@/dtos/user.dto';
import { BadRequestException } from '@/lib/exceptions';
import {
  compareHashedPassword,
  cookieOptions,
  genertateAuthToken,
  hashPassword
} from '@/lib/utils';
import { handleAsync } from '@/middlewares/handle-async';
import { users } from '@/schemas/user.schema';
import { eq } from 'drizzle-orm';

export const registerUser = handleAsync(async (req, res, next) => {
  const data = userRegisterSchema.parse(req.body);
  const [userExists] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (userExists) {
    throw new BadRequestException('Email already exists ');
  }
  const hashedPassword = await hashPassword(data.password);
  const [registeredUser] = await db
    .insert(users)
    .values({ ...data, password: hashedPassword })
    .returning({ id: users.id, name: users.name, email: users.email });
  if (!registeredUser) {
    throw new BadRequestException('Error has ocurred');
  }
  const token = genertateAuthToken(registeredUser.id);
  res.cookie('token', token, cookieOptions).json({
    message: 'User Logged Successfully',
    user: { ...registeredUser, password: undefined }
  });
});

export const loginUser = handleAsync(async (req, res) => {
  const data = userLoginSchema.parse(req.body);
  const [userExists] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (!userExists) {
    throw new BadRequestException('No such user with that email');
  }
  const isValidPassword = await compareHashedPassword({
    password: data.password,
    hashedPassword: userExists.password
  });

  if (!isValidPassword) {
    throw new BadRequestException('Incorrect Password');
  }
  const token = genertateAuthToken(userExists.id);
  res.cookie('token', token, cookieOptions).json({
    message: 'User Logged Successfully',
    user: { ...userExists, password: undefined }
  });
});

export const getProfile = handleAsync(async (req, res) => {
  return res.json({ user: req.user });
});
