import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { User } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.name = userData.name;
    this.avatar = userData.avatar;
    this.password = userData.password;
    this.isPro = userData.isPro;
  }

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: false, default: '' })
  public avatar?: string;

  @prop({ required: true, default: '' })
  public password: string;

  @prop({ required: true })
  public isPro: boolean;

  @prop({ required: false, type: String })
  public favorites: mongoose.Types.Array<string>;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
