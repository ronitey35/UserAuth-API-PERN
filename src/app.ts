import 'colors';
import express from 'express';
import morgan from 'morgan';
import { env, validateEnv } from './config/env.config';
import { NotFoundException } from './lib/exceptions';
import { devConsole } from './lib/utils';
import { handleAsync } from './middlewares/handle-async';
import { handleErrorRequest } from './middlewares/handle-error-request';
import { userRoute } from './routes/user.route';
import cookieParser from 'cookie-parser';
// import { db } from './config/database';
// import { sql } from 'drizzle-orm';

const app = express();
validateEnv();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (env.NODE_ENV === 'development') {
  app.use(morgan('common'));
}

app.get(
  '/',
  handleAsync(async (req, res) => {
    const message = 'Welcome to Authentication server';
    // const result = await db.execute(sql`select * from user`);
    return res.json({
      message,
      // result,
      env: env.NODE_ENV,
      date: new Date().toISOString()
    });
  })
);

/* --------- routes --------- */
app.use('/api', userRoute);
app.use(() => {
  throw new NotFoundException();
});
app.use(handleErrorRequest);

if (env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    devConsole(`⚡[Server]: listening at http://localhost:${env.PORT}`.yellow);
  });
}
export default app;
