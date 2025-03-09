import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';

import { BaseController, DocumentExistsMiddleware, HttpMethod, UploadFileMiddleware, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './types/login-user-request.type.js';
import { LogoutUserRequest } from './types/logout-user-request.type.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { LogoutUserDto } from './dto/logout-user.dto.js';

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
      { path: '/register', method: HttpMethod.Post, handler: this.create, middleware: [new ValidateDtoMiddleware(CreateUserDto)] },
      { path: '/login', method: HttpMethod.Post, handler: this.login, middleware: [new ValidateDtoMiddleware(LoginUserDto)] },
      { path: '/authCheck', method: HttpMethod.Get, handler: this.authStatus },
      { path: '/logout', method: HttpMethod.Post, handler: this.logout, middleware: [new ValidateDtoMiddleware(LogoutUserDto)] },
      {
        path: '/:userId/avatar',
        method: HttpMethod.Post,
        handler: this.uploadAvatar,
        middlewares: [
          new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
          new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
        ]
      }];

    this.addRoute(routes);
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<void> {
    const user = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, user));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    this.ok(res, fillDTO(UserRdo, user));
  }

  public async authStatus(
    _req: Request,
    res: Response,
  ): Promise<void> {
    // TODO: здесь будет проверка на авторизацию по токену

    this.okNoContent(res);
  }

  public async logout(
    { body }: LogoutUserRequest,
    res: Response,
  ): Promise<void> {
    await this.userService.findByEmail(body.email);

    this.okNoContent(res);
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
