'use strict';

import { config } from '../config/config.js';
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    database: config.db.database,
    password: config.db.password,
});

export const db = pool.promise();