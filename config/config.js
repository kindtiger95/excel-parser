'use strict';

import dotenv from 'dotenv';

dotenv.config();

function required(key) {
  const value = process.env[key];
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  db: {
    host: required('DB_HOST'),
    port: required('DB_PORT'),
    user: required('DB_USER'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
  },
};
