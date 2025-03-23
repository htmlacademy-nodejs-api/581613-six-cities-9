import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { SiteProcess } from '../../types/state';
import type { CityName, SortName } from '../../types/types';
import { CITIES, CityLocation, Sorting, StoreSlice } from '../../const';

const initialState: SiteProcess = {
  city: CITIES[0],
  sorting: Sorting.Popular,
};

export const siteProcess = createSlice({
  name: StoreSlice.SiteProcess,
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<CityName>) => {
      state.city = action.payload;
    },
    setSorting: (state, action: PayloadAction<SortName>) => {
      state.sorting = action.payload;
    }
  },
});

export const { setCity, setSorting } = siteProcess.actions;
