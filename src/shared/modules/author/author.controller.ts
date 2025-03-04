import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { AuthorService } from './author-service.interface.js';
import { CreateAuthorRequest } from './create-author-request.type.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { AuthorRdo } from './rdo/author.rdo.js';
import { LoginAuthorRequest } from './login-author-request.type.js';
import { LogoutAuthorRequest } from './logout-author-request.type.js';

@injectable()
export class AuthorController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.AuthorService) private readonly authorService: AuthorService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for AuthorController');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.status });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
  }

  public async create({ body }: CreateAuthorRequest, res: Response): Promise<void> {
    const existsUser = await this.authorService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» already exist`,
        'AuthorController'
      );
    }

    const result = await this.authorService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(AuthorRdo, result));
  }

  public async login(
    { body }: LoginAuthorRequest,
    res: Response,
  ): Promise<void> {
    if (!body.password) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Auht failed. password empty',
        'AuthorController',
      );

    }

    const existsUser = await this.authorService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email «${body.email}» dont exist`,
        'AuthorController',
      );
    }

    this.created(res, fillDTO(AuthorRdo, existsUser));
  }

  public async status(
    { query }: Request,
    res: Response,
  ): Promise<void> {
    const user = await this.authorService.findById(query.userId as string);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with id «${query.userId}» not found`,
        'AuthorController',
      );
    }

    this.okNoContent(res);
  }

  public async logout(
    { body }: LogoutAuthorRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.authorService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email «${body.email}» not found`,
        'AuthorController',
      );
    }

    this.okNoContent(res);
  }
}
