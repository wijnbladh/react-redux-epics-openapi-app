import { combineReducers } from '@reduxjs/toolkit';
import { postSlice } from './api/postSlice';
import { userSlice } from './api/userSlice';

export const apiSlice = combineReducers({ users: userSlice, posts: postSlice });
