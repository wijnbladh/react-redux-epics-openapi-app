import { configureStore } from '@reduxjs/toolkit';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { postEpics } from './api/postSlice';
import { userEpics } from './api/userSlice';
import { apiSlice } from './apiSlice';
import { requestEpics } from './app/requestSlice';
import { appSlice } from './appSlice';
import { ACTION_TYPE_APP_STARTED } from './consts';

const epicMiddleware = createEpicMiddleware();

const _store = configureStore({
  reducer: {
    api: apiSlice,
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const rootEpic = combineEpics(
  ...requestEpics,
  ...userEpics,
  ...postEpics
);
epicMiddleware.run(rootEpic as any);

export type RootState = ReturnType<typeof _store.getState>;

export const store = _store;

_store.dispatch({ type: ACTION_TYPE_APP_STARTED });
