import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { DocumentAuthor } from '../../../types/document-author.interface.js';

export class ValidateAuthorMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentAuthor,
    private readonly paramName: string,
  ) { }

  public async execute({ tokenPayload, params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentAuthor = await this.service.documentAuthor(params[this.paramName]);

    if (tokenPayload.id !== documentAuthor) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `user with id ${tokenPayload.id} cannot change this ${this.paramName}`,
        'ValidateAuthorMiddleware'
      );
    }

    return next();
  }
}
