import { Expose } from 'class-transformer';

export class CommentRdo {
  @Expose()
  public text: string;

  @Expose({ name: 'createdAt'})
  public date: string;

  @Expose()
  public rating: number;

  @Expose()
  public user: string;
}
