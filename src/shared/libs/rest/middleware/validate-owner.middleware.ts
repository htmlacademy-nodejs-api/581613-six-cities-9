import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { DocumentOwner } from '../../../types/document-owner.interface.js';

export class ValidateOwnerMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentOwner,
    private readonly paramName: string,
  ) { }

  public async execute({ tokenPayload, params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentOwner = await this.service.documentOwner(params[this.paramName]);

    if (tokenPayload.id !== documentOwner) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `user with id ${tokenPayload.id} cannot change this ${this.paramName}`,
        'ValidateOwnerMiddleware'
      );
    }

    return next();
  }
}
