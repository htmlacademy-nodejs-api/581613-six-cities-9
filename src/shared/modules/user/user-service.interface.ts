import { DocumentType } from '@typegoose/typegoose';

import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findByEmailOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  changeFavouriteOffer(userId: string, offerId: string, isDelete?: boolean): Promise<DocumentType<UserEntity> | null>;
}
