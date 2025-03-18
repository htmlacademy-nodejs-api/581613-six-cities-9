import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { convertToNumber, fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { UserService } from '../user/user-service.interface.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { FavouriteOfferRequest } from './types/favourite-offer-request.type.js';
import { UpdateOfferRequest } from './types/update-offer-request.type.js';
import { OfferRequestParams } from './types/offer-list-request.type.js';
import { PremiumOfferRequest } from './types/premium-offer-request.type.js';
import { FavouritesOfferRequest } from './types/favourites-offer-request.type.js';
import { OffersListRequestParams } from './types/offer-request-params.type copy.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { FavouriteOfferDto } from './dto/favourite-offer.dto.js';

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
    const validateFavouriteOfferMiddleware = new ValidateDtoMiddleware(FavouriteOfferDto);
    const validateOfferIdMiddleware = new ValidateObjectIdMiddleware('offerId');

    const routes = [
      { path: '/', method: HttpMethod.Get, handler: this.index },
      { path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [privateRouteMiddleware, new ValidateDtoMiddleware(CreateOfferDto)] },
      { path: '/premium', method: HttpMethod.Get, handler: this.premium },
      { path: '/favourites', method: HttpMethod.Get, handler: this.getFavourites },
      { path: '/favourites', method: HttpMethod.Post, handler: this.addFavourites, middlewares: [privateRouteMiddleware, validateFavouriteOfferMiddleware] },
      { path: '/favourites', method: HttpMethod.Delete, handler: this.deleteFavourites, middlewares: [validateFavouriteOfferMiddleware] },
      {
        path: '/:offerId', method: HttpMethod.Get, handler: this.item,
        middlewares: [validateOfferIdMiddleware, offerExistsMiddleware]
      },
      {
        path: '/:offerId', method: HttpMethod.Patch, handler: this.updateItem,
        middlewares: [validateOfferIdMiddleware, new ValidateDtoMiddleware(UpdateOfferDto), offerExistsMiddleware]
      },
      {
        path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteItem,
        middlewares: [validateOfferIdMiddleware, offerExistsMiddleware]
      },
    ];

    this.addRoute(routes);
  }

  public async index({ query }: OffersListRequestParams, res: Response): Promise<void> {
    const offers = await this.offerService.findAll(convertToNumber(query.count));

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.findByTitleOrCreate(body);

    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async premium({ query }: PremiumOfferRequest, res: Response): Promise<void> {
    if (!query.city) {
      return;
    }

    const offers = await this.offerService.findPremiumByCity(query.city);

    this.created(res, fillDTO(OfferRdo, offers));
  }

  public async getFavourites({ query }: FavouritesOfferRequest, res: Response): Promise<void> {
    if (!query.userId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Bad Request params',
        'OfferController',
      );
    }

    const user = await this.userService.findById(query.userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${query.userId} not found`,
        'OfferController',
      );
    }

    const offers = await this.offerService.findAllByIds(user.favourites);

    this.created(res, fillDTO(OfferRdo, offers));
  }

  public async addFavourites({ body }: FavouriteOfferRequest, res: Response): Promise<void> {
    await this.userService.changeFavouriteOffer(body.userId, body.offerId, false);

    this.okNoContent(res);
  }

  public async deleteFavourites({ body }: FavouriteOfferRequest, res: Response): Promise<void> {
    await this.userService.changeFavouriteOffer(body.userId, body.offerId, true);

    this.okNoContent(res);
  }

  public async item({ params }: OfferRequestParams, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found`,
        'UserController',
      );
    }

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
