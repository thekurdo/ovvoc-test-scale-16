import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, selectUsers, selectUsersLoading, selectUsersError, selectUsersPagination, setPage, deleteUser } from '../store/slices/usersSlice';
import { addNotification } from '../store/slices/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

function Users() {
  const dispatch = useDispatch();
  const history = useHistory();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const { page, perPage, total } = useSelector(selectUsersPagination);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const paginatedUsers = users.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(total / perPage);

  const handleViewUser = (id) => {
    history.push(`/users/${id}`);
  };

  const handleDeleteUser = async (id) => {
    await dispatch(deleteUser(id));
    dispatch(addNotification({ type: 'success', message: 'User deleted successfully' }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div data-testid="users-page">
      <h1>Users</h1>
      <p>Total: {total} users</p>

      <table data-testid="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id} data-testid={`user-row-${user.id}`}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
              <td><span className={`status status-${user.status}`}>{user.status}</span></td>
              <td>
                <button onClick={() => handleViewUser(user.id)} data-testid={`view-user-${user.id}`}>View</button>
                <button onClick={() => handleDeleteUser(user.id)} data-testid={`delete-user-${user.id}`}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => dispatch(setPage(p))}
      />
    </div>
  );
}

export default Users;
