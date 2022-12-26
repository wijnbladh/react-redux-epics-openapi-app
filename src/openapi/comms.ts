import { UsersApi, PostsApi } from "./gencode";

let usersApi: UsersApi;
export const getUsersApi = () => {
  if (!usersApi) {
    usersApi = new UsersApi();
  }
  return usersApi;
}

let postsApi: PostsApi;
export const getPostsApi = () => {
  if (!postsApi) {
    postsApi = new PostsApi();
  }
  return postsApi;
}
