import React from 'react'
import {connect} from 'react-redux'
import {fetchUser} from '../redux/actions/userActions'
import { FormText } from 'react-bootstrap';


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
                        <h3>Sign In</h3>

                        <div className="form-group">
                            <label>Username</label>
                            <input 
                                type="text" 
                                name="username" 
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
                                <FormText>
                                    {/* {this.props.errors} */}
                                    {this.props.errors.map((error, i) => <p key={i}>{error}</p>)}
                                </FormText>
                            }
                        </div>

                        <button
                            type="submit"
                            value="Login"
                            className="btn btn-primary btn-block">
                                Submit
                        </button>
                        <p className="forgot-password text-right">
                            <a href="/register">Register</a>
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