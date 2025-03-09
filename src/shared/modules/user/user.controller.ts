import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './types/login-user-request.type.js';
import { LogoutUserRequest } from './types/logout-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    const routes = [
      { path: '/register', method: HttpMethod.Post, handler: this.create },
      { path: '/login', method: HttpMethod.Post, handler: this.login },
      { path: '/login', method: HttpMethod.Get, handler: this.status },
      { path: '/logout', method: HttpMethod.Post, handler: this.logout },
    ];

    this.addRoute(routes);
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» already exist`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `User with email ${body.email} doesn't exists`,
        'UserController',
      );
    }

    this.created(res, fillDTO(UserRdo, existsUser));
  }

  public async status(
    { query }: Request,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findById(query.userId as string);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with id ${query.userId} not found`,
        'UserController',
      );
    }

    this.okNoContent(res);
  }

  public async logout(
    { body }: LogoutUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found`,
        'UserController',
      );
    }

    this.okNoContent(res);
  }
}
