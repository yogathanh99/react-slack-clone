import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Home from 'pages/Home';
import Login from 'pages/Auth/Login';
import Register from 'pages/Auth/Register';
import Spinner from 'components/Spinner';

import * as actions from 'store/actions';
import styled from 'styled-components';
import firebase from 'config/firebase';

// import './App.css';

const Layout = styled.div`
  height: 100vh;
  background: #eee;
  padding: 1em;
`;

class App extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push('/');
      } else {
        this.props.history.push('/login');
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner primary />
    ) : (
      <Layout>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
        </Switch>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading,
});

const mapDispatchToProps = {
  setUser: actions.setUser,
  clearUser: actions.clearUser,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
