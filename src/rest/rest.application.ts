import { inject, injectable } from 'inversify';
import express from 'express';
import cors from 'cors';

import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getFullServerPath, getMongoURI } from '../shared/helpers/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from './rest.constant.js';

@injectable()
export class RestApplication {
  private readonly server = express();

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.CommentController) private readonly commentsController: Controller,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
  ) { }

  private async initDb() {
    this.logger.info('Init database started');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    this.logger.info('Init database completed');
    return this.databaseClient.connect(mongoUri);
  }

  private async initServer() {
    this.logger.info('Try to init server');
    const port = this.config.get('PORT');
    this.server.listen(port);
    this.logger.info(`Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }

  private async initExceptionFilters() {
    this.logger.info('Init exception filters');
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
    this.logger.info('Exception filters initialization compleated');
  }

  private async initMiddleware() {
    this.logger.info('Init app-level middleware');

    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));

    this.server.use(express.json());
    this.server.use(
      STATIC_UPLOAD_ROUTE,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      STATIC_FILES_ROUTE,
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());

    this.logger.info('App-level middleware initialization completed');
  }

  private async initControllers() {
    this.logger.info('Init controllers');

    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/comments', this.commentsController.router);

    this.logger.info('Controller initialization completed');
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    await this.initDb();
    await this.initMiddleware();
    await this.initControllers();
    await this.initExceptionFilters();
    await this.initServer();
  }
}
