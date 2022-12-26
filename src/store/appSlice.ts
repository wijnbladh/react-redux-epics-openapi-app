import { combineReducers } from "@reduxjs/toolkit";
import { requestSlice } from "./app/requestSlice";

export const appSlice = combineReducers({
  requests: requestSlice,
});
