import { DataSourceOptions } from 'typeorm';

let config: DataSourceOptions;
if (process.env.USE_SQLITE === 'true') {
  config = {
    type: 'sqlite',
    database: process.env.DB_NAME || ':memory:',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  } as DataSourceOptions;
} else {
  config = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'bcm',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.DEV_SYNC === 'true',
  } as DataSourceOptions;
}


export default config as DataSourceOptions;
