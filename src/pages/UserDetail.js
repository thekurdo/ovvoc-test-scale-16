import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserById, selectCurrentUser, selectUsersLoading, selectUsersError, clearCurrentUser } from '../store/slices/usersSlice';
import LoadingSpinner from '../components/LoadingSpinner';

// React Router v5: useParams + useHistory
function UserDetail() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    dispatch(fetchUserById(id));
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id]);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleEditPosts = () => {
    history.push(`/posts?author=${id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div data-testid="user-detail-page">
      <button onClick={handleGoBack} data-testid="back-button">Back</button>
      <h1>{user.name}</h1>
      <div className="user-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> <span className={`badge badge-${user.role}`}>{user.role}</span></p>
        <p><strong>Status:</strong> <span className={`status status-${user.status}`}>{user.status}</span></p>
      </div>
      <button onClick={handleEditPosts} data-testid="view-posts-button">View Posts</button>
    </div>
  );
}

export default UserDetail;
