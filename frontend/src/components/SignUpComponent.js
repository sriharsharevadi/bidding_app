import React from 'react'
import {connect} from 'react-redux'
import {createUser, fetchUser} from '../redux/actions/userActions'
import { FormText } from 'react-bootstrap';

class SignUpComponent extends React.Component {
    state = {
        username: "",
        password: "",
        email: ""
    }

    handleOnChange = (e) => {
        // console.log(e)
        e.persist();
        this.setState(() => ({
            [e.target.name]: e.target.value 
        }))
    }

    onSubmit = (e) => {
        console.log(e)
        e.preventDefault()
        this.props.createUser(this.state)
        // this.props.fetchUser(this.state)

    }

    render(){
        // console.log(this.props.errors)
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
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        value={this.state.email}
                        onChange={this.handleOnChange}
                        className="form-control" 
                    />
                        {/* <label className="custom-control-label" htmlFor="customCheck1">Remember me</label> */}
                </div>
                
                <div>
                    { this.props.errors && this.props.errors[0] &&
                        <FormText>
                            {/* {this.props.errors} */}
                            {this.props.errors.map((error, i) => <p key={i}>{error}</p>)}
                        </FormText>
                    }
                </div>

                <button type="submit" name="Login" className="btn btn-primary btn-block">Register</button>
            </form>
            <button type="button" className="btn btn-secondary mb-2" >Login</button>
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
        createUser: (userInfo) => dispatch(createUser(userInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpComponent)