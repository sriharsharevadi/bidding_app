import React from 'react';
import './App.css';
import {connect} from 'react-redux'
import LoginComponent from './components/LoginComponentt'
import SignUpComponent from './components/SignUpComponent'
import OrderComponent from './components/OrderComponent'
import MyOrderComponent from './components/MyOrdersComponent'
import MyBidsComponent from './components/MyBidsComponent'


import {autoLogin} from './redux/actions/userActions'
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom"

class App extends React.Component{

  componentDidMount(props){
    this.props.autoLogin()
  }

  render(props){
    return (
      // <div className="App">
      //       {
      //         !this.props.userReducer.loggedIn ? <h1>Sign Up or Login!</h1> : <h1>Welcome, {this.props.userReducer.user.username}</h1>
      //       }
      //      <SignUpComponent/>
      //      <LoginComponent/>
      //      <button>Logout</button>
      // </div>
      <div className="App">
        <Router>
          <Switch>
            {/* <PublicRoute restricted={false} component={Home} path="/" exact /> */}
            <PublicRoute restricted={true} component={LoginComponent} {...props} path="/login" exact />
            <PublicRoute restricted={true} component={SignUpComponent} path="/register" exact />
            <PrivateRoute component={OrderComponent} path="/" exact />
            <PrivateRoute component={MyOrderComponent} path="/myorders" exact />
            <PrivateRoute component={MyBidsComponent} path="*" exact />
          </Switch>
        </Router>


      {/* <Router>
        <Switch>
          <Route path="/login">
            <LoginComponent />
          </Route>
          <Route path="/signup">
            <SignUpComponent />
          </Route>
          <Route path="/">
          {

              !this.props.userReducer.loggedIn ? <h1>Sign Up or Login!</h1> : <OrderComponent />
            }
          </Route>
        </Switch>
    </Router> */}
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
