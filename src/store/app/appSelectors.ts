import { createSelector } from '@reduxjs/toolkit';
import { RequestLabel } from '../consts';
import { RootState } from '../store';
import { RequestState } from './requestSlice';

export const selectRequestSlice = createSelector(
  (state: RootState) => state.app.requests,
  (requestSlice) => requestSlice
);

export const selectFetchAllUsersRequestState = createSelector(
  selectRequestSlice,
  (requestSlice) =>
    requestSlice[RequestLabel.FetchAllUsers] ?? {
      label: RequestLabel.FetchAllUsers,
      state: RequestState.Initial,
    }
);

export const selectFetchAllPostsRequestState = createSelector(
  selectRequestSlice,
  (requestSlice) =>
    requestSlice[RequestLabel.FetchAllPosts] ?? {
      label: RequestLabel.FetchAllPosts,
      state: RequestState.Initial,
    }
);

export const selectFetchAllCommentsRequestState = createSelector(
  selectRequestSlice,
  (requestSlice) =>
    requestSlice[RequestLabel.FetchAllComments] ?? {
      label: RequestLabel.FetchAllComments,
      state: RequestState.Initial,
    }
);

