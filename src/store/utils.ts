import { Request, RequestState } from './app/requestSlice';

export const getTimeoutSignal = (
  timeoutMillis: number = 15000
): AbortSignal => {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort, timeoutMillis);
  return abortController.signal;
};

export const isRequestBusy = (request: Request) =>
  request.state === RequestState.Running;

export const isRequestInError = (request: Request) =>
  request.state === RequestState.InError;
