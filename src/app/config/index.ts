/* eslint-disable prettier/prettier */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { SignOptions } from 'jsonwebtoken';
dotenv.config({ path: path.join(process.cwd(), '.env') });
export default {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expires_in: (process.env.JWT_EXPIRES_IN ||
      '7d') as SignOptions['expiresIn'],
  },
};
