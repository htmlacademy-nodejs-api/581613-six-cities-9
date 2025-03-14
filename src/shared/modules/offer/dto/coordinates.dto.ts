import { IsLatitude, IsLongitude } from 'class-validator';
import { getDefaultInvalidText } from '../../../helpers/common.js';

export class CoordinatesDto {
  @IsLatitude({ message: getDefaultInvalidText('latitude') })
    latitude: number;

  @IsLongitude({ message: getDefaultInvalidText('latitude') })
    longitude: number;
}
