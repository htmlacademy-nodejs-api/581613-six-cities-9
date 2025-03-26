import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) { }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, avatar: DEFAULT_AVATAR_FILE_NAME });
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id);
  }

  public async findByEmailOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = await this.findByEmail(dto.email);

    return user ?? await this.create(dto, salt);
  }

  public async changeFavoriteOffer(userId: string, offerId: string, isDelete: boolean): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      [isDelete ? '$pull' : '$push']: {
        favorites: offerId,
      },
    }, { new: true });
  }


  public async exists(id: string): Promise<boolean> {
    return (await this.userModel
      .exists({ _id: id })) !== null;
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .exec();
  }
}
