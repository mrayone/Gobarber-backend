import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';
import '@shared/infra/typeorm/';
import '@shared/container';
import 'express-async-errors';
import cors from 'cors';
import uploadConfig from '@shared/config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middleware/rateLimiterRedis';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.tempDir));
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, async () => {
  console.log('🚀️  Back-end started on port 3333!');
});
