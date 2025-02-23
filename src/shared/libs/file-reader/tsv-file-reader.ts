import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { FeatureType, Offer, OfferType, Coordinates, City } from '../../types/index.js';
import { COMMA_SEPARATOR, NEXT_LINE_SEPARATOR, TAB_SEPARATOR } from '../../constants/index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(
    private readonly filename: string
  ) {
    super();
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      createdDate,
      city,
      previewImage,
      images,
      premium,
      rating,
      type,
      roomsCount,
      guestsCount,
      price,
      features,
      author,
      commentsCount,
      coordinates
    ] = line.split(TAB_SEPARATOR);

    return {
      title,
      description,
      postDate: new Date(createdDate),
      city: city as City,
      previewImage,
      images: this.parseImages(images),
      premium: this.parseBoolean(premium),
      rating: Number(rating),
      type: type as OfferType,
      roomsCount: Number(roomsCount),
      guestsCount: Number(guestsCount),
      price: Number(price),
      features: this.parseFeatures(features),
      author,
      commentsCount: Number(commentsCount),
      coordinates: this.parseCoordinates(coordinates)
    };
  }

  private parseBoolean(booleanSting: string): boolean {
    return booleanSting === 'true';
  }

  private parseImages(images: string): string[] {
    return images.split(COMMA_SEPARATOR);
  }

  private parseFeatures(features: string): FeatureType[] {
    return features.split(COMMA_SEPARATOR) as FeatureType[];
  }

  private parseCoordinates(coordinates: string): Coordinates {
    const [latitude, longitude] = coordinates.split(COMMA_SEPARATOR);
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();
      while ((nextLinePosition = remainingData.indexOf(NEXT_LINE_SEPARATOR)) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;
        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }
}
