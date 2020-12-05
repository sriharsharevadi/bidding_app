import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux'


const PublicRoute = ({component: Component,userReducer, restricted, ...rest }) => {
  // console.log(rest.location)
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route {...rest} render={props => (
      userReducer.loggedIn && restricted ?
      // console.log(props)
      props.location.state ?
        <Redirect to={props.location.state.from.pathname}/>
        : <Redirect to= '/' />
      : <Component {...props} />
    )} />
  );
};

const mapStateToProps = (state) => {
  return {
    userReducer: state.userReducer
  }
}

export default connect(mapStateToProps)(PublicRoute);
