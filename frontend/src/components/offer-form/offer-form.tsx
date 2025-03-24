import { FormEvent, useCallback, useState } from 'react';
import Select from 'react-select';

import { CityName, NewOffer, Offer } from '../../types/types';

import LocationPicker from '../location-picker/location-picker';
import { CITIES, CityLocation, GOODS, TYPES } from '../../const';
import { capitalize } from '../../utils';

enum FormFieldName {
  title = 'title',
  description = 'description',
  cityName = 'cityName',
  previewImage = 'previewImage',
  premium = 'premium',
  type = 'type',
  bedrooms = 'bedrooms',
  maxAdults = 'maxAdults',
  price = 'price',
  feature = 'feature-',
  image = 'image'
}

const getGoods = (
  entries: IterableIterator<[string, FormDataEntryValue]>
): string[] => {
  const chosenGoods: string[] = [];
  for (const entry of entries) {
    if (entry[0].startsWith(FormFieldName.feature)) {
      chosenGoods.push(entry[0].slice(FormFieldName.feature.length));
    }
  }
  return chosenGoods;
};

const getCity = (cityName: FormDataEntryValue | null): CityName => {
  const name = String(cityName);
  if (cityName && CITIES.includes(name)) {
    return name
  }

  return CITIES[0];
};

const getImages = (
  entries: IterableIterator<[string, FormDataEntryValue]>
): string[] => {
  const enteredImages: string[] = [];
  for (const entry of entries) {
    if (entry[0].startsWith(FormFieldName.image) && typeof entry[1] === 'string') {
      enteredImages.push(entry[1]);
    }
  }
  return enteredImages;
};

type OfferFormProps<T> = {
  offer: T;
  onSubmit: (offerData: T) => void;
};

const OfferForm = <T extends Offer | NewOffer>({
  offer,
  onSubmit,
}: OfferFormProps<T>): JSX.Element => {
  const {
    title,
    description,
    city,
    previewImage,
    premium,
    type,
    roomsCount,
    guestsCount,
    price,
    features: chosenGoods,
    coordinates,
    images
  } = offer;
  const [chosenLocation, setChosenLocation] = useState(coordinates);
  const [chosenCity, setChosenCity] = useState(city);

  const handleCityChange = (value: keyof typeof CityLocation) => {
    setChosenCity(getCity(value));
    setChosenLocation(CityLocation[value]);
  };

  const handleLocationChange = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      setChosenLocation({ latitude: lat, longitude: lng });
    },
    []
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      ...offer,
      title: formData.get(FormFieldName.title),
      description: formData.get(FormFieldName.description),
      city: getCity(formData.get(FormFieldName.cityName)),
      previewImage: formData.get(FormFieldName.previewImage),
      premium: Boolean(formData.get(FormFieldName.premium)),
      type: formData.get(FormFieldName.type),
      bedrooms: Number(formData.get(FormFieldName.bedrooms)),
      maxAdults: Number(formData.get(FormFieldName.maxAdults)),
      price: Number(formData.get(FormFieldName.price)),
      features: getGoods(formData.entries()),
      location: chosenLocation,
      images: getImages(formData.entries()),
    };

    onSubmit(data);
  };

  return (
    <form
      className="form offer-form"
      action="#"
      method="post"
      onSubmit={handleFormSubmit}
    >
      <fieldset className="title-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="title" className="title-fieldset__label">
            Title
          </label>
          <input
            className="form__input title-fieldset__text-input"
            placeholder="Title"
            name={FormFieldName.title}
            id="title"
            required
            defaultValue={title}
          />
        </div>
        <div className="title-fieldset__checkbox-wrapper">
          <input
            className="form__input"
            type="checkbox"
            name={FormFieldName.premium}
            id="premium"
            defaultChecked={premium}
          />
          <label htmlFor="premium" className="title-fieldset__checkbox-label">
            Premium
          </label>
        </div>
      </fieldset>
      <div className="form__input-wrapper">
        <label htmlFor="description" className="offer-form__label">
          Description
        </label>
        <textarea
          className="form__input offer-form__textarea"
          placeholder="Description"
          name={FormFieldName.description}
          id="description"
          required
          defaultValue={description}
        />
      </div>
      <div className="form__input-wrapper">
        <label htmlFor="previewImage" className="offer-form__label">
          Preview Image
        </label>
        <input
          className="form__input offer-form__text-input"
          type="url"
          placeholder="Preview image"
          name={FormFieldName.previewImage}
          id="previewImage"
          required
          defaultValue={previewImage}
        />
      </div>
      <fieldset className="images-fieldset">
        {images.map((image, index) => (
          <div key={image} className="form__input-wrapper">
            <label htmlFor={`image=${index}`} className="offer-form__label">
          Offer Image #{index + 1}
            </label>
            <input
              className="form__input offer-form__text-input"
              type="url"
              placeholder="Offer image"
              name={`${FormFieldName.image}-${index}`}
              id={`image-${index}`}
              required
              defaultValue={image}
            />
          </div>
        ))}

      </fieldset>
      <fieldset className="type-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="type" className="type-fieldset__label">
            Type
          </label>
          <Select
            className="type-fieldset__select"
            classNamePrefix="react-select"
            name={FormFieldName.type}
            id="type"
            defaultValue={{ value: type, label: capitalize(type) }}
            options={TYPES.map((typeItem) => ({
              value: typeItem,
              label: capitalize(typeItem),
            }))}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="price" className="type-fieldset__label">
            Price
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="100"
            name={FormFieldName.price}
            id="price"
            defaultValue={price}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="bedrooms" className="type-fieldset__label">
            Bedrooms
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.bedrooms}
            id="bedrooms"
            required
            step={1}
            defaultValue={roomsCount}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="maxAdults" className="type-fieldset__label">
            Max adults
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.maxAdults}
            id="maxAdults"
            required
            step={1}
            defaultValue={guestsCount}
          />
        </div>
      </fieldset>
      <fieldset className="features-list">
        <h2 className="features-list__title">Goods</h2>
        <ul className="features-list__list">
          {GOODS.map((feature) => (
            <li key={feature} className="features-list__item">
              <input
                type="checkbox"
                id={feature}
                name={`${FormFieldName.feature}${feature}`}
                defaultChecked={chosenGoods.includes(feature)}
              />
              <label className="features-list__label" htmlFor={feature}>
                {feature}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="form__input-wrapper location-picker">
        <label htmlFor="cityName" className="location-picker__label">
          Location
        </label>
        <Select
          className="location-picker__select"
          classNamePrefix="react-select"
          name={FormFieldName.cityName}
          id="cityName"
          defaultValue={{ value: city, label: city }}
          options={CITIES.map((cityItem) => ({
            value: cityItem,
            label: cityItem,
          }))}
          onChange={(evt) => {
            if (evt) {
              handleCityChange(evt.value);
            }
          }}
        />
      </div>
      <LocationPicker
        city={CityLocation[chosenCity]}
        onChange={handleLocationChange}
        location={chosenLocation}
      />
      <button className="form__submit button" type="submit">
        Save
      </button>
    </form>
  );
};

export default OfferForm;
