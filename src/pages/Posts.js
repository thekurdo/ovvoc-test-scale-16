import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPosts,
  selectPosts,
  selectPostsLoading,
  selectPostsError,
  selectPostFilters,
  selectPostsPagination,
  setPostFilters,
  setPostPage,
  deletePost,
} from '../store/slices/postsSlice';
import { addNotification } from '../store/slices/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

function Posts() {
  const dispatch = useDispatch();
  const history = useHistory();
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const filters = useSelector(selectPostFilters);
  const { page, perPage, total } = useSelector(selectPostsPagination);

  useEffect(() => {
    dispatch(fetchPosts(filters));
  }, [dispatch, filters]);

  const paginatedPosts = posts.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(total / perPage);

  const handleViewPost = (id) => {
    history.push(`/posts/${id}`);
  };

  const handleNewPost = () => {
    history.push('/posts/new');
  };

  const handleDeletePost = async (id) => {
    await dispatch(deletePost(id));
    dispatch(addNotification({ type: 'success', message: 'Post deleted' }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div data-testid="posts-page">
      <div className="page-header">
        <h1>Posts</h1>
        <button onClick={handleNewPost} data-testid="new-post-button">New Post</button>
      </div>

      <div className="filters" data-testid="post-filters">
        <select
          value={filters.category}
          onChange={(e) => dispatch(setPostFilters({ category: e.target.value }))}
          data-testid="category-filter"
        >
          <option value="">All Categories</option>
          <option value="tutorial">Tutorial</option>
          <option value="guide">Guide</option>
          <option value="article">Article</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => dispatch(setPostFilters({ status: e.target.value }))}
          data-testid="status-filter"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="post-list" data-testid="post-list">
        {paginatedPosts.map((post) => (
          <div key={post.id} className="post-card" data-testid={`post-card-${post.id}`}>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}...</p>
            <div className="post-meta">
              <span className={`badge badge-${post.category}`}>{post.category}</span>
              <span className={`status status-${post.status}`}>{post.status}</span>
              <span>{post.createdAt}</span>
            </div>
            <div className="post-actions">
              <button onClick={() => handleViewPost(post.id)}>View</button>
              <button onClick={() => history.push(`/posts/${post.id}/edit`)}>Edit</button>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => dispatch(setPostPage(p))}
      />
    </div>
  );
}

export default Posts;
