import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostById, selectCurrentPost, selectPostsLoading, selectPostsError, clearCurrentPost, deletePost } from '../store/slices/postsSlice';
import { addNotification } from '../store/slices/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';

function PostDetail() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const post = useSelector(selectCurrentPost);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    await dispatch(deletePost(Number(id)));
    dispatch(addNotification({ type: 'success', message: 'Post deleted' }));
    history.push('/posts');
  };

  const handleGoBack = () => {
    history.goBack();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div data-testid="post-detail-page">
      <button onClick={handleGoBack} data-testid="back-button">Back</button>

      <article>
        <header>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className={`badge badge-${post.category}`}>{post.category}</span>
            <span className={`status status-${post.status}`}>{post.status}</span>
            <time>{post.createdAt}</time>
          </div>
        </header>

        <div className="post-body" data-testid="post-body">
          <p>{post.body}</p>
        </div>

        <footer>
          <button onClick={handleEdit} data-testid="edit-button">Edit</button>
          <button onClick={handleDelete} data-testid="delete-button">Delete</button>
        </footer>
      </article>
    </div>
  );
}

export default PostDetail;
