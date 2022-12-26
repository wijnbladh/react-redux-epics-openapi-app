import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'reactstrap';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { AppNavigation } from '../../components/Navigation/Navigation';
import { UserBadges } from '../../components/UserBadges/UserBadges';
import { selectPosts, selectUsers } from '../../store/api/apiSelectors';
import { fetchAllPostsStartActionCreator } from '../../store/api/postSlice';
import { fetchAllUsersStartActionCreator } from '../../store/api/userSlice';
import {
  selectFetchAllPostsRequestState,
  selectFetchAllUsersRequestState,
} from '../../store/app/appSelectors';
import { isRequestBusy } from '../../store/utils';
import styles from './UsersPage.module.scss';

export const UsersPage: React.FC = () => {
  const dispatch = useDispatch();

  const users = useSelector(selectUsers);
  const posts = useSelector(selectPosts);
  const fetchAllUsersRequestState = useSelector(
    selectFetchAllUsersRequestState
  );
  const fetchAllPostsRequestState = useSelector(
    selectFetchAllPostsRequestState
  );

  const [selectedUserId, setSelectedUserId] = useState(0);

  const usersAsArray = useMemo(
    () => Object.keys(users).map((key) => users[key]),
    [users]
  );

  const postsOfSelectedUser = useMemo(() => {
    if (selectedUserId) {
      return Object.keys(posts)
        .filter((key) => posts[key].userId === selectedUserId)
        .map((key) => posts[key]);
    }
    return [];
  }, [selectedUserId, posts]);

  useEffect(() => {
    // Kind of a "didMount"...
    if (usersAsArray.length === 0) {
      dispatch(fetchAllUsersStartActionCreator());
    }
  }, [usersAsArray, dispatch]);

  useEffect(() => {
    if (selectedUserId && Object.keys(posts).length === 0) {
      dispatch(fetchAllPostsStartActionCreator());
    }
  }, [selectedUserId, posts, dispatch]);

  return (
    <div>
      <h1 className="p-2">react-redux-epics-openapi-app: Users</h1>
      <hr />
      <AppNavigation />
      <hr />
      {isRequestBusy(fetchAllUsersRequestState) ? (
        <LoadingSpinner />
      ) : (
        <>
          <UserBadges
            selectedUserId={selectedUserId}
            users={usersAsArray}
            onBadgeClicked={setSelectedUserId}
          />
          <hr />
          {isRequestBusy(fetchAllPostsRequestState) ? (
            <LoadingSpinner />
          ) : selectedUserId ? (
            <>
              <div className={styles.container__posts}>
                {postsOfSelectedUser.length > 0 ? (
                  postsOfSelectedUser.map((post) => (
                    <Alert color="warning" key={post.id}>
                      <div>
                        <h5>{post.title}</h5>
                        <p>
                          {post.body.length > 200
                            ? `${post.body.substring(0, 200)}...`
                            : post.body}
                        </p>
                      </div>
                    </Alert>
                  ))
                ) : (
                  <p>...</p>
                )}
              </div>
              <hr />
              <UserBadges
                selectedUserId={selectedUserId}
                users={usersAsArray}
                onBadgeClicked={(userId: number) => {
                  setSelectedUserId(userId);
                  window.scrollTo({ left: 0, top: 0 });
                }}
              />
              <hr />
            </>
          ) : null}
        </>
      )}
    </div>
  );
};
