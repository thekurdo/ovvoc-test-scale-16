import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectUser } from '../store/slices/authSlice';
import { selectUsers, fetchUsers } from '../store/slices/usersSlice';
import { selectPosts, fetchPosts } from '../store/slices/postsSlice';
import { selectNotifications } from '../store/slices/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const posts = useSelector(selectPosts);
  const notifications = useSelector(selectNotifications);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  const stats = [
    { label: 'Total Users', value: users.length, path: '/users' },
    { label: 'Total Posts', value: posts.length, path: '/posts' },
    { label: 'Published', value: posts.filter((p) => p.status === 'published').length, path: '/posts' },
    { label: 'Notifications', value: notifications.length, path: '/settings' },
  ];

  const handleStatClick = (path) => {
    history.push(path);
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div data-testid="home-page">
      <h1>Dashboard</h1>
      <p>Welcome back, {user.name}!</p>

      <div className="stats-grid" data-testid="stats-grid">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            onClick={() => handleStatClick(stat.path)}
            data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="recent-posts">
        <h2>Recent Posts</h2>
        {posts.slice(0, 5).map((post) => (
          <div key={post.id} className="post-preview" onClick={() => history.push(`/posts/${post.id}`)}>
            <h4>{post.title}</h4>
            <span className={`badge badge-${post.status}`}>{post.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
