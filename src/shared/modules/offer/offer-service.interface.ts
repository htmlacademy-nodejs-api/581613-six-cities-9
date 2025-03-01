import { DocumentType } from '@typegoose/typegoose';

import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findByTitle(title: string): Promise<DocumentType<OfferEntity> | null>;
  findByTitleOrCreate(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
}
