import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import PostEditor from './pages/PostEditor';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// React Router v5 pattern: Switch + Route with component prop
function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/users" component={Users} />
        <PrivateRoute exact path="/users/:id" component={UserDetail} />
        <PrivateRoute exact path="/posts" component={Posts} />
        <PrivateRoute exact path="/posts/new" component={PostEditor} />
        <PrivateRoute exact path="/posts/:id" component={PostDetail} />
        <PrivateRoute exact path="/posts/:id/edit" component={PostEditor} />
        <PrivateRoute exact path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
