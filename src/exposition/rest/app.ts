import 'reflect-metadata';

import express from 'express';
import { Server } from 'http';
import { useExpressServer } from 'routing-controllers';
import swaggerUi from 'swagger-ui-express';
import { Inject, Service } from 'typedi';
import { ILogger } from "@core/interfaces/ILogger";

import { configureExpressApp } from './config/express';
import { routingConfig } from './config/routing';
import { swaggerSpec } from './config/swagger';

@Service()
export class App {
  public app: express.Application;
  public server: Server;

  constructor(@Inject('ILogger') private logger: ILogger) {
    this.app = express();
    this.initializeMiddlewares();
    this.setupSwagger();
  }

  private initializeMiddlewares(): void {
    this.app.use((this.logger as any).expressLogger);
  }

  private setupSwagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  public async start(port: number): Promise<express.Application> {
    configureExpressApp(this.app);
    useExpressServer(this.app, routingConfig);

    this.server = this.app.listen(port, () => {
      this.logger.logInfo(`Server is running on port ${port}`);
      this.logger.logInfo(`Swagger documentation available at http://localhost:${port}/api-docs`);
    });
    return this.app;
  }
}