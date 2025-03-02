import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { Author } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

@modelOptions({
  schemaOptions: {
    collection: 'authors',
    timestamps: true,
  }
})
export class AuthorEntity extends defaultClasses.TimeStamps implements Author {
  constructor(userData: Author) {
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
  public avatar: string;

  @prop({ required: true, default: '' })
  public password: string;

  @prop({ required: true })
  public isPro: boolean;

  @prop({ required: false })
  public favourites: string[];

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const AuthorModel = getModelForClass(AuthorEntity);
