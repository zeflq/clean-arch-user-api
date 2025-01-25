import 'dotenv/config'
import 'reflect-metadata';
import 'module-alias/register';

import { Container } from 'typedi';
import { ILogger } from '@core/interfaces/ILogger';
import { App } from '@exposition/rest/app';
import { createContainer } from '@infrastructure/DependencyInjection';
import { gracefulShutdown } from '@infrastructure/utils/GracefulShutdown';

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  try {
    await createContainer();
    Container.set(App, new App(Container.get('ILogger')));

    const appInstance = Container.get(App);
    await appInstance.start(PORT);

    const logger = Container.get<ILogger>('ILogger');
    process.on('SIGINT', async () => await gracefulShutdown(appInstance.server, logger));
    process.on('SIGTERM', async () => await gracefulShutdown(appInstance.server, logger));


  } catch (error) {
    console.error('❌ Error during startup:', error);
    process.exit(1);
  }
}

bootstrap();