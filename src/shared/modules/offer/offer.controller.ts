import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { convertToNumber, fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { UserService } from '../user/user-service.interface.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { UpdateOfferRequest } from './types/update-offer-request.type.js';
import { OfferRequestParams } from './types/offer-list-request.type.js';
import { PremiumOfferRequest } from './types/premium-offer-request.type.js';
import { OffersListRequestParams } from './types/offer-request-params.type copy.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { ValidateAuthorMiddleware } from '../../libs/rest/middleware/validate-author.middleware.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.CommentService) private readonly commentsService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    const offerExistsMiddleware = new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId');
    const privateRouteMiddleware = new PrivateRouteMiddleware();
    const validateOfferIdMiddleware = new ValidateObjectIdMiddleware('offerId');
    const validateAuthorMiddleware = new ValidateAuthorMiddleware(this.offerService, 'offerId');

    const routes = [
      { path: '/', method: HttpMethod.Get, handler: this.index },
      { path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [privateRouteMiddleware, new ValidateDtoMiddleware(CreateOfferDto)] },
      { path: '/premium', method: HttpMethod.Get, handler: this.premium },
      { path: '/favourites', method: HttpMethod.Get, handler: this.getFavourites, middlewares: [privateRouteMiddleware] },
      { path: '/favourites/:offerId', method: HttpMethod.Post, handler: this.addFavourites, middlewares: [privateRouteMiddleware, offerExistsMiddleware] },
      { path: '/favourites/:offerId', method: HttpMethod.Delete, handler: this.deleteFavourites, middlewares: [privateRouteMiddleware, offerExistsMiddleware] },
      {
        path: '/:offerId', method: HttpMethod.Get, handler: this.item,
        middlewares: [validateOfferIdMiddleware, offerExistsMiddleware]
      },
      {
        path: '/:offerId', method: HttpMethod.Patch, handler: this.updateItem,
        middlewares: [privateRouteMiddleware, validateOfferIdMiddleware, offerExistsMiddleware, validateAuthorMiddleware, new ValidateDtoMiddleware(UpdateOfferDto)]
      },
      {
        path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteItem,
        middlewares: [privateRouteMiddleware, validateOfferIdMiddleware, offerExistsMiddleware, validateAuthorMiddleware]
      },
    ];

    this.addRoute(routes);
  }

  public async index({ query }: OffersListRequestParams, res: Response): Promise<void> {
    const offers = await this.offerService.findAll(convertToNumber(query.count));

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.findByTitleOrCreate({ ...body, user: tokenPayload.id });

    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async premium({ query }: PremiumOfferRequest, res: Response): Promise<void> {
    if (!query.city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City is undefined',
        'OfferController',
      );

      return;
    }

    const offers = await this.offerService.findPremiumByCity(query.city);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavourites({ tokenPayload }: Request, res: Response): Promise<void> {
    const user = await this.userService.findById(tokenPayload.id);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${tokenPayload.id} not found`,
        'OfferController',
      );
    }

    const offers = await this.offerService.findAllByIds(user.favourites);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async addFavourites({ params, tokenPayload }: OfferRequestParams, res: Response): Promise<void> {
    await this.userService.changeFavouriteOffer(tokenPayload.id, params.offerId, false);

    this.okNoContent(res);
  }

  public async deleteFavourites({ params, tokenPayload }: OfferRequestParams, res: Response): Promise<void> {
    await this.userService.changeFavouriteOffer(tokenPayload.id, params.offerId, true);

    this.okNoContent(res);
  }

  public async item({ params }: OfferRequestParams, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async deleteItem({ params }: OfferRequestParams, res: Response): Promise<void> {
    await this.offerService.delete(params.offerId);
    await this.commentsService.deleteByOfferId(params.offerId);

    this.okNoContent(res);
  }

  public async updateItem({ body, params }: UpdateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.update(params.offerId, body);

    this.ok(res, offer);
  }
}
