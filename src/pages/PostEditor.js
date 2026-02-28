import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostById, createPost, updatePost, selectCurrentPost, selectPostsLoading, clearCurrentPost } from '../store/slices/postsSlice';
import { selectUser } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';

function PostEditor() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentPost = useSelector(selectCurrentPost);
  const loading = useSelector(selectPostsLoading);
  const user = useSelector(selectUser);
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'tutorial',
    status: 'draft',
  });

  useEffect(() => {
    if (isEditing) {
      dispatch(fetchPostById(id));
    }
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (currentPost && isEditing) {
      setFormData({
        title: currentPost.title,
        body: currentPost.body,
        category: currentPost.category,
        status: currentPost.status,
      });
    }
  }, [currentPost, isEditing]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await dispatch(updatePost({ id: Number(id), ...formData }));
      dispatch(addNotification({ type: 'success', message: 'Post updated' }));
    } else {
      await dispatch(createPost({ ...formData, authorId: user?.id }));
      dispatch(addNotification({ type: 'success', message: 'Post created' }));
    }
    history.push('/posts');
  };

  const handleCancel = () => {
    history.goBack();
  };

  if (loading && isEditing) return <LoadingSpinner />;

  return (
    <div data-testid="post-editor-page">
      <h1>{isEditing ? 'Edit Post' : 'New Post'}</h1>
      <form onSubmit={handleSubmit} data-testid="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post title"
            required
            data-testid="title-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Write your post..."
            rows={10}
            required
            data-testid="body-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} data-testid="category-select">
            <option value="tutorial">Tutorial</option>
            <option value="guide">Guide</option>
            <option value="article">Article</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} data-testid="status-select">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" data-testid="submit-button">
            {isEditing ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={handleCancel} data-testid="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default PostEditor;
