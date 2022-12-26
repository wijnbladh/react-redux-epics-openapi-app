import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ofType, StateObservable } from 'redux-observable';
import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { getUsersApi } from '../../openapi/comms';
import { User } from '../../openapi/gencode';
import { createRequest } from '../app/requestSlice';
import { ACTION_TYPE_APP_STARTED, RequestLabel } from '../consts';
import { RootState } from '../store';
import { getTimeoutSignal } from '../utils';

export interface UsersDict {
  [key: string]: User;
}

export interface UserSlice {
  users: UsersDict;
}

const initialState: UserSlice = {
  users: {},
};

const _userSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    setUsers: (state: UserSlice, action: PayloadAction<User[]>) => {
      const incomingUserArray = Array.isArray(action.payload)
        ? action.payload
        : [];
      const newUsersDict = incomingUserArray.reduce((aggregate, nextItem) => {
        aggregate[nextItem.username] = nextItem;
        return aggregate;
      }, {} as UsersDict);
      state.users = newUsersDict;
    },
  },
});

export const { setUsers } = _userSlice.actions;
export const userSlice = _userSlice.reducer;

export const {
  startActionCreator: fetchAllUsersStartActionCreator,
  startEpic: fetchAllUsersStartEpic,
  doEpic: fetchAllUsersDoEpic,
  successActionType: fetchAllUsersSuccessActionType,
} = createRequest({
  label: RequestLabel.FetchAllUsers,
  requestFunc: async () => {
    const response = await getUsersApi().getAllUsers({
      signal: getTimeoutSignal(),
    });
    return response;
  },
});

export const fetchAllUsersAtAppStart = (
  action$: any,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(ACTION_TYPE_APP_STARTED),
    mergeMap(() => {
      return of(fetchAllUsersStartActionCreator());
    })
  );
};

export const reactToAllUsersFetched = (
  action$: any,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(fetchAllUsersSuccessActionType),
    map((action: PayloadAction<{ invocation: any; outcome: User[] }>) => {
      return setUsers(action.payload.outcome);
    })
  );
};

export const userEpics = [
  fetchAllUsersStartEpic,
  fetchAllUsersDoEpic,
  fetchAllUsersAtAppStart,
  reactToAllUsersFetched,
];
