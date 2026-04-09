import pgPromise, { IDatabase, IMain } from 'pg-promise';

const pgp: IMain = pgPromise();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'npcirs_test',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
};

export const db: IDatabase<any> = pgp(dbConfig);
