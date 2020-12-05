import React from 'react'
import {connect} from 'react-redux'
import {fetchUser} from '../redux/actions/userActions'
import { FormText } from 'react-bootstrap';
import { Link } from 'react-router-dom';



class LoginComponent extends React.Component {
    state = {
        username: "",
        password: ""
    }

    handleOnChange = (e) => {
        e.persist();
        this.setState(() => ({
            [e.target.name]: e.target.value 
        }))
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.props.fetchUser(this.state)
    }

    render(){
        return(
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.onSubmit}>
                        <h3>Log In</h3>

                        <div className="form-group">
                            <label>Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                required={true}
                                placeholder="Username" 
                                value={this.state.username}
                                onChange={this.handleOnChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                name="password"
                                required={true}
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleOnChange}
                                className="form-control" 
                            />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                            </div>
                        </div>

                        <div>
                            { this.props.errors && this.props.errors[0] &&
                                <div className="alert alert-danger m-0">
                                    {this.props.errors.map((error, i) => <p className="m-0" key={i}>{error}</p>)}
                                </div>
                                    
                            }
                        </div>

                        <button
                            type="submit"
                            value="Login"
                            className="btn btn-primary btn-block">
                                Log In
                        </button>
                        <p className="forgot-password text-right">
                            <Link to="/register"><button type="button" class="btn btn-secondary btn-sm">Register</button></Link>
                        </p>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      errors: state.errorReducer.errors
    }
  }

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUser: (userInfo) => dispatch(fetchUser(userInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent)