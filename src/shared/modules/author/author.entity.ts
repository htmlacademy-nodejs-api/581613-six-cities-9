import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { Author } from '../../types/index.js';

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
    this.type = userData.type;
  }

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: false, default: '' })
  public avatar: string;

  @prop({ required: true })
  public password: string;

  @prop({ required: true })
  public type: boolean;
}

export const AuthorModel = getModelForClass(AuthorEntity);
