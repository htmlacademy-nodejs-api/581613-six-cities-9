import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';

import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, UploadFileMiddleware, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './types/login-user-request.type.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { UploadUserAvatarRdo } from './rdo/upload-user-avatar.rdo.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController');

    const routes = [
      { path: '/register', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateUserDto)] },
      { path: '/login', method: HttpMethod.Post, handler: this.login, middlewares: [new ValidateDtoMiddleware(LoginUserDto)] },
      { path: '/authCheck', method: HttpMethod.Get, handler: this.authCheck, middlewares: [new PrivateRouteMiddleware()]},
      {
        path: '/avatar',
        method: HttpMethod.Post,
        handler: this.uploadAvatar,
        middlewares: [
          new PrivateRouteMiddleware(),
          new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
          new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
        ]
      }];

    this.addRoute(routes);
  }

  public async create({ body, tokenPayload }: CreateUserRequest, res: Response): Promise<void> {
    if (tokenPayload) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'User already registered',
        'UserController'
      );
    }

    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exist`,
        'UserController'
      );
    }

    const user = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, user));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });

    this.ok(res, responseData);
  }

  public async authCheck({ tokenPayload: { id } }: Request, res: Response) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'user not found',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, user));
  }

  public async uploadAvatar({ file, tokenPayload }: Request, res: Response) {
    const { id: userId } = tokenPayload;

    const uploadFile = { avatarPath: file?.filename };
    await this.userService.updateById(userId, uploadFile);

    this.created(res, fillDTO(UploadUserAvatarRdo, { filepath: uploadFile.avatarPath }));
  }
}
