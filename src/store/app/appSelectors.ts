import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectRequestState = createSelector(
  (state: RootState) => state.app.requests,
  (requestState) => requestState
);
