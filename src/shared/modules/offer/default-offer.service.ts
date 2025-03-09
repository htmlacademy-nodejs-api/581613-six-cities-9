import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { City, Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { COMMENTS_DECREMENT, COMMENTS_INCREMENT, NUMBER_HALF_SEPARATOR, RATING_DECIMAL_PLACES_NUMBER } from './offer.constants.js';

const DEFAULT_OFFERS_COUNT = 50;
const PREMIUM_OFFERS_COUNT = 3;

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) { }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findByTitle(title: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({ title }).exec();
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).populate(['user']).exec();
  }

  public async findByTitleOrCreate(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = await this.findByTitle(dto.title);

    return offer ?? this.create(dto);
  }

  public async findAll(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFERS_COUNT;

    return this.offerModel.find().sort({ createdAt: SortType.Down })
      .limit(limit).exec();
  }

  public async delete(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(id);
  }

  public async update(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate(['user'])
      .exec();
  }

  public async updateCommentsCount(id: string, isAddComment: boolean): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, {
        '$inc': {
          commentsCount: isAddComment ? COMMENTS_INCREMENT : COMMENTS_DECREMENT,
        },
      }).exec();
  }

  public async updateRating(id: string, rating: number): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(id);

    const newRating = offer?.rating ? ((Number(offer?.rating) + rating) / NUMBER_HALF_SEPARATOR).toFixed(RATING_DECIMAL_PLACES_NUMBER) : rating;

    return this.offerModel
      .findByIdAndUpdate(id, { ...offer, rating: newRating }, { new: true })
      .populate(['user'])
      .exec();
  }

  public async findPremiumByCity(city: City,): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel.find({ city, premium: true }).sort({ createdAt: SortType.Down })
      .limit(PREMIUM_OFFERS_COUNT).exec();
  }

  public async findAllByIds(ids: string[]): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel.find({ '_id': { $in: ids } });
  }
}
