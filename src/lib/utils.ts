import { env } from '@/config/env.config';
import { compare, hash } from 'bcryptjs';
import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
export const devConsole = (...args: string[]) => {
  if (env.NODE_ENV !== 'production') {
    console.log(args.join(' '));
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
};

export const compareHashedPassword = async ({
  hashedPassword,
  password
}: {
  hashedPassword: string;
  password: string;
}): Promise<boolean> => {
  const isValidPassword = await compare(password, hashedPassword);
  return isValidPassword;
};

export const genertateAuthToken = (id: string) => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY);
  return token;
};
export const decodeAuthToken = (token: string): string | null => {
  const decoded = jwt.verify(token, process.env.SECRET_KEY) as unknown as
    | undefined
    | { id: string };
  return decoded?.id || null;
};

export const cookieOptions: CookieOptions = {
  maxAge: Date.now() + 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: env.NODE_ENV !== 'production' ? false : true,
  sameSite: env.NODE_ENV !== 'production' ? 'lax' : 'none'
};
