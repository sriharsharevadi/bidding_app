import React from 'react'
import {connect} from 'react-redux'
import {createUser} from '../redux/actions/userActions'
import { Link } from 'react-router-dom';


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
                <h3>Register</h3>

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
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        required={true}
                        placeholder="Email Address" 
                        value={this.state.email}
                        onChange={this.handleOnChange}
                        className="form-control" 
                    />
                        {/* <label className="custom-control-label" htmlFor="customCheck1">Remember me</label> */}
                </div>
                
                <div>
                    { this.props.errors && this.props.errors[0] &&
                        <div className="alert alert-danger m-0">
                            {this.props.errors.map((error, i) => <p className="m-0" key={i}>{error}</p>)}
                        </div>      
                    }
                </div>

                <button type="submit" name="Login" className="btn btn-primary btn-block">Register</button>
                    <p className="forgot-password text-right">
                        <Link to="/login"><button type="button" className="btn btn-secondary btn-sm">Log in</button></Link>
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
        createUser: (userInfo) => dispatch(createUser(userInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpComponent)