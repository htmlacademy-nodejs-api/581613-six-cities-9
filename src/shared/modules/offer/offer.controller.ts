import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { UserService } from '../user/user-service.interface.js';
import { FavouriteOfferRequest } from './types/favourite-offer-request.type.js';
import { UpdateOfferRequest } from './types/update-offer-request.type.js';
import { OfferRequestParams } from './types/offer-request-params.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    const routes = [
      { path: '/', method: HttpMethod.Get, handler: this.index },
      { path: '/', method: HttpMethod.Post, handler: this.create },
      { path: '/premium', method: HttpMethod.Get, handler: this.premium },
      { path: '/favourites', method: HttpMethod.Get, handler: this.getFavourites },
      { path: '/favourites', method: HttpMethod.Post, handler: this.addFavourites },
      { path: '/favourites', method: HttpMethod.Delete, handler: this.deleteFavourites },
      { path: '/:offerId', method: HttpMethod.Get, handler: this.item },
      { path: '/:offerId', method: HttpMethod.Patch, handler: this.updateItem },
      { path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteItem },
    ]

    this.addRoute(routes);
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findAll();

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.findByTitleOrCreate(body);

    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async premium({ query }: Request, res: Response): Promise<void> {

    if (!query.city) {
      return;
    }
    const offers = await this.offerService.findPremiumByCity(query.city as City);

    this.created(res, fillDTO(OfferRdo, offers));
  }

  public async getFavourites({ query }: GetFavouriteOffersRequest, res: Response): Promise<void> {
    const user = await this.userService.findById(query.userId as string);

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

    this.okNoContent(res);
  }

  public async updateItem({ body, params }: UpdateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.update(params.offerId, body);

    this.ok(res, offer);
  }
}
