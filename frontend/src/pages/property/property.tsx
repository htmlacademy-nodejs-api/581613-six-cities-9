import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import ReviewList from '../../components/review-list/review-list';
import Map from '../../components/map/map';
import Card from '../../components/card/card';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchOffer,
  fetchPremiumOffers,
  fetchComments,
  postComment,
  deleteOffer,
} from '../../store/action';
import Spinner from '../../components/spinner/spinner';
import { capitalize, getStarsWidth, pluralize } from '../../utils';
import { NewComment } from '../../types/types';
import { getIsAuthorized } from '../../store/user-process/selectors';
import {
  getIsOfferLoading,
  getPremiumOffers,
  getOffer,
  selectComments,
  getCommentStatus,
} from '../../store/site-data/selectors';
import { getUser } from '../../store/user-process/selectors';
import Bookmark from '../../components/bookmark/bookmark';
import { AppRoute, CITIES, CityLocation } from '../../const';

const Property = (): JSX.Element | null => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const isAuthorized = useAppSelector(getIsAuthorized);
  const isOfferLoading = useAppSelector(getIsOfferLoading);
  const user = useAppSelector(getUser);
  const offer = useAppSelector(getOffer);
  const premiumOffers = useAppSelector(getPremiumOffers);
  const comments = useAppSelector(selectComments);
  const commentStatus = useAppSelector(getCommentStatus);

  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch(fetchOffer(id));
      dispatch(fetchComments(id));
    }
  }, [params, dispatch]);

  useEffect(() => {
    if (offer) {
      dispatch(fetchPremiumOffers(offer.city));
    }
  }, [dispatch, offer]);

  if (isOfferLoading) {
    return <Spinner />;
  }

  if (!offer) {
    return null;
  }

  const {
    id,
    images,
    premium,
    isFavorite,
    title,
    rating,
    type,
    guestsCount,
    roomsCount,
    price,
    features,
    user: host,
    description,
    city,
    coordinates,
  } = offer;
  const isAuthor = host.email === user;

  const locations = premiumOffers.map(
    ({ id: premiumId, coordinates: premiumLocation }) => ({
      id: premiumId,
      ...premiumLocation,
    })
  );
  locations.push({ id, ...coordinates });

  const handleDeleteClick = () => {
    dispatch(deleteOffer(id));
  };

  const handleFormSubmit = (formData: NewComment) => {
    dispatch(postComment({ id, ...formData }));
  };

  return (
    <div className="page">
      <main className="page__main page__main--property">
        <section className="property">
          <div className="property__gallery-container container">
            <div className="property__gallery">
              {images.map((image) => (
                <div key={image} className="property__image-wrapper">
                  <img className="property__image" src={image} alt="Studio" />
                </div>
              ))}
            </div>
          </div>
          <div className="property__container container">
            <div className="property__wrapper">
              {premium && (
                <div className="property__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="property__name-wrapper">
                <h1 className="property__name">{title}</h1>
                <Bookmark id={id} isActive={isFavorite} place="property" />
              </div>
              {isAuthor && (
                <div className="property__controls">
                  <Link
                    to={`${AppRoute.Property}/${id}${AppRoute.Edit}`}
                    className="property__edit-link"
                  >
                    Edit
                  </Link>
                  <button
                    className="property__delete-button"
                    type="button"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                </div>
              )}
              <div className="property__rating rating">
                <div className="property__stars rating__stars">
                  <span style={{ width: getStarsWidth(rating) }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="property__rating-value rating__value">
                  {rating}
                </span>
              </div>
              <ul className="property__features">
                <li className="property__feature property__feature--entire">
                  {capitalize(type)}
                </li>
                <li className="property__feature property__feature--roomsCount">
                  {roomsCount} {pluralize('Bedroom', roomsCount)}
                </li>
                <li className="property__feature property__feature--adults">
                  Max {guestsCount} {pluralize('adult', guestsCount)}
                </li>
              </ul>
              <div className="property__price">
                <b className="property__price-value">€{price}</b>
                <span className="property__price-text">&nbsp;night</span>
              </div>
              <div className="property__inside">
                <h2 className="property__inside-title">What`&apos;s inside</h2>
                {features.length > 0 && (
                  <ul className="property__inside-list">
                    {features.map((feature) => (
                      <li key={feature} className="property__inside-item">
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="property__host">
                <h2 className="property__host-title">Meet the host</h2>
                <div className="property__host-user user">
                  <div
                    className={`property__avatar-wrapper${
                      host.isPro ? ' property__avatar-wrapper--pro' : ''
                    } user__avatar-wrapper`}
                  >
                    <img
                      className="property__avatar user__avatar"
                      src={host.avatarUrl}
                      width={74}
                      height={74}
                      alt={host.name}
                    />
                  </div>
                  <span className="property__user-name">{host.name}</span>
                  {host.isPro && (
                    <span className="property__user-status">Pro</span>
                  )}
                </div>
                <div className="property__description">
                  <p className="property__text">{description}</p>
                </div>
              </div>
              <ReviewList
                reviews={comments}
                isAuthorized={isAuthorized}
                onSubmit={handleFormSubmit}
                submitStatus={commentStatus}
              />
            </div>
          </div>
          <Map
            cityName={city}
            locations={locations}
            activeOffer={id}
            place="property"
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Premium offers
            </h2>
            <div className="near-places__list places__list">
              {premiumOffers.map((premiumOffer) => (
                <Card
                  key={premiumOffer.id}
                  {...premiumOffer}
                  classPrefix="near-places"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Property;
