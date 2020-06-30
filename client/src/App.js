import React, { useEffect, useCallback, Suspense } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import './App.css';
import Layout from './hoc/Layout/Layout';
import Spinner from './components/UI/Spinner/Spinner';
import * as actions from './store/actions/index';

const SignIn = React.lazy(() => {
   return import('./containers/Auth/SignIn/SignIn');
});

const SignUp = React.lazy(() => {
  return import('./containers/Auth/SignUp/SignUp');
});

const Logout = React.lazy(() => {
  return import('./containers/Auth/Logout/Logout');
});

const Blog = React.lazy(() => {
  return import('./containers/Blog/Blog');
});

const Profile = React.lazy(() => {
  return import('./containers/Profile/Profile');
});

const MyPosts = React.lazy(() => {
  return import('./containers/Profile/MyPosts/MyPosts');
});

const Update = React.lazy(() => {
  return import('./containers/Profile/Update/Update');
});

const Users = React.lazy(() => {
  return import('./containers/Profile/Users/Users');
});

const App = (props) => {

  const dispatch = useDispatch();

  const onLogin =  useCallback(
    () => dispatch(actions.authCheckState()),
     [dispatch]
   );
   
    useEffect(() => {
      onLogin();
    },[onLogin]);

 const role = useSelector(state => {
  return state.auth.role;
 });

     let routes;
     if (!role) {
       routes = (
        <Switch>
        <Route path="/signin" render={(props) => <SignIn {...props} />} />
        <Route path="/signup" render={(props) => <SignUp {...props} />} />
        <Route path="/"  exact render={(props) => <Blog {...props} />} />
        <Redirect to="/"/>
        </Switch>
       );
     } else if(role === 'user') {
      routes = (
      <Switch>
        <Route path="/logout" render={(props) => <Logout {...props} />} />
        <Route path="/profile/myposts" render={(props) => <MyPosts {...props} />} />
        <Route path="/profile/update" render={(props) => <Update {...props} />} />
        <Route path="/profile"  render={(props) => <Profile {...props} />}/>
        <Route path="/" exact render={(props) => <Blog {...props} />} />
        <Redirect to="/profile"/>
      </Switch>
      );
    } else if (role === 'admin') {
      routes = (
        <Switch>
          <Route path="/logout" render={(props) => <Logout {...props} />} />
          <Route path="/profile/myposts" render={(props) => <MyPosts {...props} />} />
          <Route path="/profile/update" render={(props) => <Update {...props} />} />
          <Route path="/users" render={(props) => <Users {...props} />} />
          <Route path="/profile"  render={(props) => <Profile {...props} />}/>
          <Route path="/" exact render={(props) => <Blog {...props} />} />
          <Redirect to="/profile"/>
        </Switch>
        );
    }

    return (
      <div>
        <Layout>
            <Suspense fallback={<Spinner/>}>
                  {routes}
            </Suspense>
       </Layout>
      </div>
     
  );
}

export default withRouter(App);




