import { DocumentType } from '@typegoose/typegoose';

import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from '../../types/cities.enum.js';
import { CreateCommentDto } from '../comment/index.js';
import { DocumentExists } from '../../types/document-exists.interface.js';
import { DocumentAuthor } from '../../types/document-author.interface.js';

export interface OfferService extends DocumentExists, DocumentAuthor {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findByTitle(title: string): Promise<DocumentType<OfferEntity> | null>;
  findByTitleOrCreate(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  findAll(count?: number): Promise<DocumentType<OfferEntity>[]>;
  delete(id: string): Promise<DocumentType<OfferEntity> | null>;
  update(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  addReview(commentDto: CreateCommentDto): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[] | null>;
  findAllByIds(ids: string[]): Promise<DocumentType<OfferEntity | null>[] | null>;
  exists(id: string): Promise<boolean>;
  documentAuthor(id: string): Promise<string | null>;
}
