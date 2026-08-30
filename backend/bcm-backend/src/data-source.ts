import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';

// Use process.cwd() for robustness across CommonJS and ESM invocation contexts
const baseDir = process.cwd();

const dataSource = new DataSource({
  type: (process.env.USE_SQLITE === 'true') ? 'sqlite' : 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'bcm',
  entities: [path.join(baseDir, 'dist', '**', '*.entity.js'), path.join(baseDir, 'src', '**', '*.entity.ts')],
  migrations: [path.join(baseDir, 'dist', 'migrations', '*.js'), path.join(baseDir, 'migrations', '*.sql')],
  synchronize: false,
});

export default dataSource;
