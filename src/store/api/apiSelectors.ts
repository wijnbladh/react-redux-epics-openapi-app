import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectUserSlice = createSelector(
  (state: RootState) => state.api.users,
  (userSlice) => userSlice
);

export const selectUsers = createSelector(
  selectUserSlice,
  (userSlice) => userSlice.users
);

export const selectPostsSlice = createSelector(
  (state: RootState) => state.api.posts,
  (postSlice) => postSlice
);

export const selectPosts = createSelector(
  selectPostsSlice,
  (postSlice) => postSlice.posts
);

export const selectComments = createSelector(
  selectPostsSlice,
  (postSlice) => postSlice.comments
);

