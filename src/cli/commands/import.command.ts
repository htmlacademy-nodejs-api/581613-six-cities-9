import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Offer } from '../../shared/types/offer.type.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { DefaultOfferService, OfferModel } from '../../shared/modules/offer/index.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { PinoLogger } from '../../shared/libs/logger/pino.logger.js';
import { DEFAULT_DB_PORT } from './command.constant.js';

export class ImportCommand implements Command {
  public readonly name = '--import';
  private logger = new PinoLogger();
  private offerService = new DefaultOfferService(this.logger, OfferModel);
  private databaseClient = new MongoDatabaseClient(this.logger);

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
  }

  private async onImportedOffer(offer: Offer, resolve: () => void): Promise<void> {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate || new Date(),
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      premium: offer.premium,
      rating: offer.rating,
      type: offer.type,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      features: offer.features,
      user: offer.user,
      coordinates: offer.coordinates
    });
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
