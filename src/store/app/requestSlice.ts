import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ofType, StateObservable } from 'redux-observable';
import { EMPTY, of } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { ACTION_TYPE_REQUEST_FINISHED, RequestLabel } from '../consts';
import { RootState } from '../store';
import { selectRequestSlice } from './appSelectors';

export enum RequestState {
  Initial = 1 << 0,
  Idle = 1 << 1,
  Running = 1 << 2,
  InError = 1 << 3,
}

export interface RequestError {
  status: number;
  message: string;
}

export interface Request {
  label: RequestLabel;
  state: RequestState;
  data?: any;
  error?: RequestError;
  lastRunUnixMillis?: string;
}

export interface RequestSlice {
  [key: string]: Request;
}

const initialState: RequestSlice = {};

const _requestSlice = createSlice({
  name: 'requests',
  initialState: initialState,
  reducers: {
    setRequestState: (state: RequestSlice, action: PayloadAction<Request>) => {
      const request = action.payload;
      if (request && request.label) {
        state[request.label] = request;
      }
    },
  },
});

export const { setRequestState } = _requestSlice.actions;
export const requestSlice = _requestSlice.reducer;

const requestFinishedActionCreator = (
  actionsToDispatch: (Action | PayloadAction)[]
) => ({
  type: ACTION_TYPE_REQUEST_FINISHED,
  payload: actionsToDispatch,
});

export const finishRequestEpic = (
  action$: any,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(ACTION_TYPE_REQUEST_FINISHED),
    mergeMap((action: PayloadAction<(Action | PayloadAction)[]>) => {
      return of(...action.payload);
    })
  );
};

export const createRequest = (options: {
  label: RequestLabel;
  requestFunc: Function;
}) => {
  const startActionType = `START_${options.label}`;
  const doActionType = `DO_${options.label}`;
  const successActionType = `SUCCESS_${options.label}`;
  const failureActionType = `FAILURE_${options.label}`;

  const startActionCreator = <I extends { isForced?: boolean }>(
    payload?: I
  ) => ({
    type: startActionType,
    payload: payload,
  });
  const doActionCreator = <I extends { isForced?: boolean }>(payload?: I) => ({
    type: doActionType,
    payload: payload,
  });
  const successActionCreator = <I extends { isForced?: boolean }, O>(payload: {
    invocation?: I;
    outcome?: O;
  }) => ({
    type: successActionType,
    payload,
  });
  const failureActionCreator = <
    I extends { isForced?: boolean },
    RequestError
  >(payload: {
    invocation: I;
    error: RequestError;
  }) => ({
    type: failureActionType,
    payload,
  });

  const startEpic = (action$: any, state$: StateObservable<RootState>) => {
    return action$.pipe(
      ofType(startActionType),
      mergeMap(<I extends { isForced?: boolean }>(action: PayloadAction<I>) => {
        const requests = selectRequestSlice(state$.value);
        const request = requests[options.label] ?? undefined;
        if (
          request?.state === RequestState.Running &&
          !action.payload?.isForced
        ) {
          return EMPTY;
        }
        const newRequestState: Request = {
          label: options.label,
          state: RequestState.Running,
        };
        return of(
          setRequestState(newRequestState),
          doActionCreator(action.payload)
        );
      })
    );
  };

  const doEpic = (action$: any, state$: StateObservable<RootState>) => {
    return action$.pipe(
      ofType(doActionType),
      switchMap(
        async <I extends { isForced?: boolean }>(action: PayloadAction<I>) => {
          const newRequestState: Request = {
            label: options.label,
            state: RequestState.Idle,
          };
          try {
            const response = await options.requestFunc(
              action.payload,
              state$.value
            );
            newRequestState.data = response;
            return requestFinishedActionCreator([
              setRequestState(newRequestState),
              successActionCreator({
                invocation: action.payload,
                outcome: response,
              })
            ]);
          } catch (err: any) {
            const requestError: RequestError = err.response
              ? {
                  status: err.response.status,
                  message: err.response.statusText,
                }
              : {
                  status: -1,
                  message: `${err.message} (${err.name})`,
                };
            newRequestState.error = requestError;
            return requestFinishedActionCreator([
              setRequestState(newRequestState),
              failureActionCreator({
                invocation: action.payload,
                error: requestError,
              })
            ]);
          }
        }
      )
    );
  };

  return {
    startActionType,
    startActionCreator,
    startEpic,
    doActionType,
    doActionCreator,
    doEpic,
    successActionType,
    successActionCreator,
    failureActionType,
    failureActionCreator,
  };
};

export const requestEpics = [finishRequestEpic];
