import React from 'react';
import './App.css';
import {connect} from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
} from "react-router-dom"


import LoginComponent from './components/LoginComponentt'
import SignUpComponent from './components/SignUpComponent'
import OrderComponent from './components/OrderComponent'
import MyOrderComponent from './components/MyOrdersComponent'
import MyBidsComponent from './components/MyBidsComponent'


import {autoLogin} from './redux/actions/userActions'
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';


class App extends React.Component{

  componentDidMount(props){
    this.props.autoLogin()
  }

  render(props){
    return (
      <div className="App">
        <Router>
          <Switch>
            <PublicRoute restricted={true} component={LoginComponent} {...props} path="/login" exact />
            <PublicRoute restricted={true} component={SignUpComponent} path="/register" exact />
            <PrivateRoute component={OrderComponent} path="/" exact />
            <PrivateRoute component={MyOrderComponent} path="/myorders" exact />
            <PrivateRoute component={MyBidsComponent} path="/mybids" exact />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userReducer: state.userReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    autoLogin: () => dispatch(autoLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
