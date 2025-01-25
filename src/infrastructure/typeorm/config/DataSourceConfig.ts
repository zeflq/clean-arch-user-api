import { DataSource, DataSourceOptions } from 'typeorm';

import { UserEntity } from '../entities/UserEntity';

const getDataSourceConfig = (): DataSourceOptions => {
  const isTestEnv = process.env.NODE_ENV === 'test';
  const isDevEnv = process.env.NODE_ENV === 'development';
  const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/users';

  const commonOptions = {
    entities: [UserEntity],
    synchronize: isDevEnv || isTestEnv, // Safer: disable in production
    logging: isDevEnv,                  // Enable logging only in development
  };

  // Use SQLite for testing
  if (isTestEnv) {
    return {
      type: 'sqlite',
      database: './test.sqlite',
      //database: ':memory:',
      dropSchema: false,  // Clean DB between tests
      ...commonOptions,
    };
  }

  // Use MongoDB for development/production
  return {
    type: 'mongodb',
    url: mongoUrl,
    ...commonOptions,
  };
};

export const AppDataSource = new DataSource(getDataSourceConfig());
