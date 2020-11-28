// Action Creators
import jwt_decode from "jwt-decode";
import {CREATE_USER, LOGIN_USER,VERIFY_USER} from '../../graphql/mutations'

import client from '../../graphql/graphql'

const setUser = (payload) => ({ type: "SET_USER", payload})
const error = (payload) => ({type: "ERROR", payload})

export const logUserOut = () => ({type: "LOG_OUT"})

// Methods

export const fetchUser = (userInfo) => dispatch => {
    client.mutate({
        mutation: LOGIN_USER,
        variables: {
            username: userInfo.username,
            password: userInfo.password
        },
    })
    .then(req => {
        // console.log(req.data)
        if (req.data.tokenAuth.errors){
            dispatch(error(req.data.tokenAuth.errors[0].messages))
        }
        else{
            localStorage.setItem("token", req.data.tokenAuth.token)
            dispatch(setUser(req.data.tokenAuth.payload))
        }        
    })
    .catch(err => { 
        console.log( err)
        dispatch(error([err.toString()]))
    })

}

export const createUser = (userInfo) => dispatch => {
    client.mutate({
        mutation: CREATE_USER,
        variables: {
            username: userInfo.username,
            password: userInfo.password,
            email: userInfo.email
        },
    })
    .then(req => {
        if (req.data.createUser.errors){
            dispatch(error(req.data.createUser.errors[0].messages))
        }
        else{
            fetchUser(userInfo)(dispatch)
        }
        
    })
    .catch(err => { 
        console.log(err)
    })
}

export const autoLogin = (token) => dispatch => {
    token = localStorage.getItem("token")
    if (token != null){
        if (jwt_decode(token).exp < Date.now() / 1000) {
            localStorage.clear();
        }
        else{
            // console.log(token)
            client.mutate({
                mutation: VERIFY_USER,
                variables: {
                    token: token,
                },
            })
            .then(res => res.data)
            .then(data => {
                // localStorage.setItem("token", data.token)
                // console.log(data)
                dispatch(setUser(data.verifyToken.payload))
            })
        }
    }
}


