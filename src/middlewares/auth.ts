import { decodeAuthToken } from '@/lib/utils';
import { handleAsync } from './handle-async';
import { UnauthorizedException } from '@/lib/exceptions';
import { db } from '@/config/database';
import { users } from '@/schemas/user.schema';
import { eq } from 'drizzle-orm';

export const isAuthenticated = handleAsync(async (req, res, next) => {
  const token = req.cookies?.token;
  console.log({ token });

  if (!token) {
    throw new UnauthorizedException("You're not logged in");
  }
  const userID = decodeAuthToken(token);
  console.log({ userID });
  if (!userID) {
    throw new UnauthorizedException("You're not logged in");
  }

  const [user] = await db.select().from(users).where(eq(users.id, userID));
  console.log({ user });
  if (!user) {
    throw new UnauthorizedException('you are not logged in');
  }

  const { password, ...userDetails } = user;
  req.user = userDetails;

  next();
});
