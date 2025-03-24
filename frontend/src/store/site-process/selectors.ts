import { StoreSlice } from '../../const';
import type { State } from '../../types/state';
import type { CityName, SortName } from '../../types/types';

export const getCity = ({ [StoreSlice.SiteProcess]: SITE_PROCESS }: State): CityName => SITE_PROCESS.city;
export const getSorting = ({ [StoreSlice.SiteProcess]: SITE_PROCESS }: State): SortName => SITE_PROCESS.sorting;
