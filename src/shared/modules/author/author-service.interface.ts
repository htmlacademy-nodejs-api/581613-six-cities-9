import { DocumentType } from '@typegoose/typegoose';

import { AuthorEntity } from './author.entity.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';

export interface AuthorService {
  create(dto: CreateAuthorDto, salt: string): Promise<DocumentType<AuthorEntity>>;
  findByEmail(email: string): Promise<DocumentType<AuthorEntity> | null>;
  findById(id: string): Promise<DocumentType<AuthorEntity> | null>;
  findByEmailOrCreate(dto: CreateAuthorDto, salt: string): Promise<DocumentType<AuthorEntity>>;
  changeFavouriteOffer(userId: string, offerId: string, isDelete?: boolean): Promise<DocumentType<AuthorEntity> | null>;
}
