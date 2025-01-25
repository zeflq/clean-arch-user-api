import { Server } from 'http';
import { ILogger } from '@core/interfaces/ILogger';

import { AppDataSource } from '../typeorm/config/DataSourceConfig';
/**
 * Gracefully shuts down the server and closes DB connections.
 * @param server HTTP server instance
 */
export const gracefulShutdown = async (server: Server, logger: ILogger): Promise<void> => {
  logger.logInfo('🛑 Received shutdown signal, initiating graceful shutdown...');

  const forceShutdown = setTimeout(() => {
    logger.logInfo('⚠️ Forcefully shutting down after timeout.');
    process.exit(1);
  }, 10000); // 10 seconds

  try {
    // 1. Stop accepting new connections
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          logger.logError('❌ Error closing server:', err);
          return reject(err);
        }
        logger.logInfo('✅ HTTP server closed.');
        resolve();
      });
    });

    // 2. Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.logInfo('✅ Database connection closed.');
    }

    clearTimeout(forceShutdown);
    logger.logInfo('🚀 Graceful shutdown complete.');
    process.exit(0);
  } catch (error) {
    logger.logError(`❌ Error during shutdown: ${error}` );
    clearTimeout(forceShutdown);
    process.exit(1);
  }
};
