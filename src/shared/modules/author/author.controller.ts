import { inject, injectable } from 'inversify';
// import { Request, Response } from 'express';

import { BaseController } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
// import { AuthorService } from './author-service.interface.js';

@injectable()
export class AuthorController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    // @inject(Component.AuthorService) private readonly authorService: AuthorService,
  ) {
    super(logger);

    this.logger.info('Register routes for AuthorController…');

    // this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  // public async create(req: CreateUserRequest, res: Response): Promise<void> {
  //   const user = await this.authorService.create();
  //   this.ok(res, user);
  // }
}
