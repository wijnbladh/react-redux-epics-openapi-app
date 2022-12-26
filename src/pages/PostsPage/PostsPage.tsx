import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Input } from 'reactstrap';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { AppNavigation } from '../../components/Navigation/Navigation';
import { Comment, Post } from '../../openapi/gencode';
import { selectComments, selectPosts } from '../../store/api/apiSelectors';
import {
  fetchAllCommentsStartActionCreator,
  fetchAllPostsStartActionCreator,
} from '../../store/api/postSlice';
import {
  selectFetchAllCommentsRequestState,
  selectFetchAllPostsRequestState,
} from '../../store/app/appSelectors';
import { isRequestBusy } from '../../store/utils';

interface PostWithComment extends Post {
  comments: Comment[];
}

export const PostsPage: React.FC = () => {
  const dispatch = useDispatch();

  const posts = useSelector(selectPosts);
  const comments = useSelector(selectComments);
  const fetchAllPostsRequestState = useSelector(
    selectFetchAllPostsRequestState
  );
  const fetchAllCommentsRequestState = useSelector(
    selectFetchAllCommentsRequestState
  );

  const [applyFilterTimeoutId, setApplyFilterTimeoutId] = useState(0);
  const [filterString, setFilterString] = useState('');

  useEffect(() => {
    // Kind of a "didMount"...
    if (Object.keys(posts).length === 0) {
      dispatch(fetchAllPostsStartActionCreator());
    }
    if (Object.keys(comments).length === 0) {
      dispatch(fetchAllCommentsStartActionCreator());
    }
  }, [posts, comments, dispatch]);

  const isBusy = useMemo(
    () =>
      isRequestBusy(fetchAllPostsRequestState) ||
      isRequestBusy(fetchAllCommentsRequestState),
    [fetchAllPostsRequestState, fetchAllCommentsRequestState]
  );

  const postsWithComments: PostWithComment[] = useMemo(() => {
    const commentsAsArray = Object.keys(comments).map((key) => comments[key]);
    const augmentedPosts = Object.keys(posts).map((key) => {
      const relatedPost = posts[key];
      const relatedComments = commentsAsArray.filter(
        (comment) => comment.postId === relatedPost.id
      );
      return Object.assign({}, relatedPost, { comments: relatedComments });
    });
    return augmentedPosts;
  }, [posts, comments]);

  const filteredPosts = useMemo(() => {
    if (filterString) {
      const filterStringInLowerCase = filterString.toLowerCase();
      return postsWithComments.filter((post) => {
        const stringsToSearch = [
          post.title,
          post.body,
          ...post.comments.map((comment) => `${comment.body} ${comment.email}`),
        ];
        return (
          stringsToSearch
            .map((stringToSearch) => stringToSearch.toLowerCase())
            .join(' ')
            .indexOf(filterStringInLowerCase) !== -1
        );
      });
    }
    return postsWithComments;
  }, [postsWithComments, filterString]);

  return (
    <div>
      <h1 className="p-2">react-redux-epics-openapi-app: Posts</h1>
      <hr />
      <AppNavigation />
      <hr />
      <div className="px-3">
        <Input
          type="text"
          onChange={(e) => {
            if (applyFilterTimeoutId) {
              window.clearTimeout(applyFilterTimeoutId);
            }
            setApplyFilterTimeoutId(
              window.setTimeout(() => {
                setFilterString(e.target.value);
                setApplyFilterTimeoutId(0);
              }, 1000)
            );
          }}
          placeholder="Search ..."
          disabled={isBusy}
        />
      </div>
      <hr />
      {isBusy || applyFilterTimeoutId ? (
        <LoadingSpinner />
      ) : (
        <div className="px-3">
          {filteredPosts.length === 0 ? (
            <p>(No results)</p>
          ) : (
            filteredPosts.map((post) => (
              <div>
                <Alert color="warning" key={post.id}>
                  <div>
                    <h5>{post.title}</h5>
                    <p>{post.body}</p>
                  </div>
                </Alert>
                {Array.isArray(post.comments)
                  ? post.comments.map((comment) => (
                      <Alert color="info" key={comment.id} className="ms-5">
                        <div>
                          <p>{comment.body}</p>
                          <small>{comment.email ?? 'n/a'}</small>
                        </div>
                      </Alert>
                    ))
                  : null}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
