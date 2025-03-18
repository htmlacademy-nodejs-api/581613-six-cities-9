import { IsMongoId } from 'class-validator';
import { getDefaultInvalidText } from '../../../helpers/common.js';

export class FavouriteOfferDto {
  @IsMongoId({ message: getDefaultInvalidText('offerId') })
  public offerId: string;
}
