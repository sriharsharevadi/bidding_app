import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux'


const PrivateRoute = ({component: Component,userReducer, ...rest}) => {

    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => 
            userReducer.loggedIn ?
                <Component {...props} />
            : <Redirect to="/login" />
        } />
    );
};


const mapStateToProps = (state) => {
    return {
      userReducer: state.userReducer
    }
  }
  
  
  
export default connect(mapStateToProps)(PrivateRoute);
  