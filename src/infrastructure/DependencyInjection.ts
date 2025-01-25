import { Container } from 'typedi';
import { DataSource } from 'typeorm'; 
import { ILogger } from '@core/interfaces/ILogger';

import { WinstonLogger } from './logger/WinstonLogger';
import { AppDataSource } from './typeorm/config/DataSourceConfig';
import { TypeOrmUserRepository } from './typeorm/repositories/TypeOrmUserRepository';

export const registerDependencies = (DataSource: DataSource): void => {
  Container.set<ILogger>('ILogger', WinstonLogger.getInstance());
  Container.set('IUserRepository', new TypeOrmUserRepository(DataSource));
};
export async function createContainer() {
  try {
    // Initialize TypeORM connection
    await AppDataSource.initialize();
    
    // Register the TypeORM repository with its interface token
    registerDependencies(AppDataSource);
  } catch (error: any) {
    throw new Error(`Error during dependency injection setup: ${error.message}`);
  }
}