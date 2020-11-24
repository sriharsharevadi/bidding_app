import React from 'react';
import './App.css';
import {connect} from 'react-redux'
import LoginComponent from './components/LoginComponentt'
import SignUpComponent from './components/SignUpComponent'
import OrderComponent from './components/OrderComponent'
import {autoLogin} from './redux/actions/userActions'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom"


class App extends React.Component{

  componentDidMount(){
    this.props.autoLogin()
  }

  render(){
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
          <Route path="/login">
            <LoginComponent />
          </Route>
          <Route path="/signup">
            <SignUpComponent />
          </Route>
          <Route path="/">
          {/* {
              !this.props.userReducer.loggedIn ? <h1>Sign Up or Login!</h1> : <h1>Welcome, {this.props.userReducer.user.username}</h1>
            } */}
            <OrderComponent />

          </Route>
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
