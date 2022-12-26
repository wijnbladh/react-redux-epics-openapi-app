import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ofType, StateObservable } from 'redux-observable';
import { map } from 'rxjs/operators';
import { getPostsApi } from '../../openapi/comms';
import { Comment, Post } from '../../openapi/gencode';
import { createRequest } from '../app/requestSlice';
import { RequestLabel } from '../consts';
import { RootState } from '../store';
import { getTimeoutSignal } from '../utils';

export interface PostsDict {
  [key: string]: Post;
}

export interface CommentsDict {
  [key: string]: Comment;
}

export interface PostSlice {
  posts: PostsDict;
  comments: CommentsDict;
}

const initialState: PostSlice = {
  posts: {},
  comments: {},
};

const _postSlice = createSlice({
  name: 'posts',
  initialState: initialState,
  reducers: {
    setPosts: (state: PostSlice, action: PayloadAction<Post[]>) => {
      const incomingArray = Array.isArray(action.payload) ? action.payload : [];
      const newDict = incomingArray.reduce((aggregate, nextItem) => {
        aggregate[nextItem.id] = nextItem;
        return aggregate;
      }, {} as PostsDict);
      state.posts = newDict;
    },
    setComments: (state: PostSlice, action: PayloadAction<Comment[]>) => {
      const incomingArray = Array.isArray(action.payload) ? action.payload : [];
      const newDict = incomingArray.reduce((aggregate, nextItem) => {
        aggregate[nextItem.id] = nextItem;
        return aggregate;
      }, {} as CommentsDict);
      state.comments = newDict;
    },
  },
});

export const { setPosts, setComments } = _postSlice.actions;
export const postSlice = _postSlice.reducer;

export const {
  startActionCreator: fetchAllPostsStartActionCreator,
  startEpic: fetchAllPostsStartEpic,
  doEpic: fetchAllPostsDoEpic,
  successActionType: fetchAllPostsSuccessActionType,
} = createRequest({
  label: RequestLabel.FetchAllPosts,
  requestFunc: async () => {
    const response = await getPostsApi().getAllPosts({
      signal: getTimeoutSignal(),
    });
    return response;
  },
});

export const reactToAllPostsFetched = (
  action$: any,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(fetchAllPostsSuccessActionType),
    map((action: PayloadAction<{ invocation: any; outcome: Post[] }>) => {
      return setPosts(action.payload.outcome);
    })
  );
};

export const {
  startActionCreator: fetchAllCommentsStartActionCreator,
  startEpic: fetchAllCommentsStartEpic,
  doEpic: fetchAllCommentsDoEpic,
  successActionType: fetchAllCommentsSuccessActionType,
} = createRequest({
  label: RequestLabel.FetchAllComments,
  requestFunc: async () => {
    const response = await getPostsApi().getAllComments({
      signal: getTimeoutSignal(),
    });
    return response;
  },
});

export const reactToAllCommentsFetched = (
  action$: any,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(fetchAllCommentsSuccessActionType),
    map((action: PayloadAction<{ invocation: any; outcome: Comment[] }>) => {
      return setComments(action.payload.outcome);
    })
  );
};

export const postEpics = [
  fetchAllPostsStartEpic,
  fetchAllPostsDoEpic,
  fetchAllCommentsStartEpic,
  fetchAllCommentsDoEpic,
];
