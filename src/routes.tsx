import { PostsPage } from './pages/PostsPage/PostsPage';
import { StartPage } from './pages/StartPage/StartPage';
import { UsersPage } from './pages/UsersPage/UsersPage';

export enum AppRoute {
  Start = '/',
  Users = '/users',
  Posts = '/posts',
}

export const routes = [
  {
    path: AppRoute.Start,
    element: <StartPage />,
  },
  {
    path: AppRoute.Users,
    element: <UsersPage />,
  },
  {
    path: AppRoute.Posts,
    element: <PostsPage />,
  },
];
