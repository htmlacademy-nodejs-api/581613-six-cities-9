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

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.premium });
    this.addRoute({ path: '/favourites', method: HttpMethod.Get, handler: this.getFavourites });
    this.addRoute({ path: '/favourites', method: HttpMethod.Post, handler: this.addFavourites });
    this.addRoute({ path: '/favourites', method: HttpMethod.Delete, handler: this.deleteFavourites });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.item });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.updateItem });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteItem });
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
    const offers = await this.offerService.findPremiumByCity(query.city as City);

    this.created(res, fillDTO(OfferRdo, offers));
  }

  public async getFavourites({ query }: Request, res: Response): Promise<void> {
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

  public async item({ params }: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${params.offerId}» not found`,
        'UserController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async deleteItem({ params }: Request, res: Response): Promise<void> {
    await this.offerService.delete(params.offerId);

    this.okNoContent(res);
  }

  public async updateItem({ body, params }: UpdateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.update(params.offerId as string, body);

    this.ok(res, offer);
  }
}
