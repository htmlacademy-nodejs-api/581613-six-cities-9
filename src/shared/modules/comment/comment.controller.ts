import { inject, injectable } from 'inversify';
import { Response } from 'express';

import { BaseController, DocumentExistsMiddleware, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware, PrivateRouteMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentRequest } from './types/create-comment-request.type.js';
import { convertToNumber, fillDTO } from '../../helpers/index.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { CommentsRequestParams } from './types/comments-request-params.type.js';
import { OfferService } from '../offer/index.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');

    const offerExistsMiddleware = new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId');

    const routes = [
      { path: '/:offerId', method: HttpMethod.Get, handler: this.index, middlewares: [new ValidateObjectIdMiddleware('offerId'), offerExistsMiddleware] },
      { path: '/:offerId', method: HttpMethod.Post, handler: this.create, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), offerExistsMiddleware, new ValidateDtoMiddleware(CreateCommentDto)] },
    ];

    this.addRoute(routes);
  }

  public async index(
    { params, query }: CommentsRequestParams,
    res: Response,
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId, convertToNumber(query.count));

    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create({ body, tokenPayload, params }: CreateCommentRequest, res: Response): Promise<void> {
    const comment = await this.commentService.create({ ...body, user: tokenPayload.id, offerId: params.offerId });

    await this.offerService.addReview(body);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
