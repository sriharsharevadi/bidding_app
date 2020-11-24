// Action Creators
import jwt_decode from "jwt-decode";
import {LOGIN_USER,VERIFY_USER} from '../../graphql/mutations'

import client from '../../graphql/graphql'

const setUser = (payload) => ({ type: "SET_USER", payload})

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
    .then(res => res.data)
    .then(data => {
        console.log(data)
        localStorage.setItem("token", data.tokenAuth.token)
        dispatch(setUser(data.tokenAuth.payload))
    })
}

export const signUserUp = (userInfo) => dispatch => {
    fetch(`http://localhost:4000/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(userInfo)
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("token", data.token)
        dispatch(setUser(data.user))
    })
}

export const autoLogin = (token) => dispatch => {
    token = localStorage.getItem("token")
    if (token != null){
        if (jwt_decode(token).exp < Date.now() / 1000) {
            localStorage.clear();
        }
        else{
            console.log(token)
            client.mutate({
                mutation: VERIFY_USER,
                variables: {
                    token: token,
                },
            })
            .then(res => res.data)
            .then(data => {
                // localStorage.setItem("token", data.token)
                console.log(data)
                dispatch(setUser(data.verifyToken.payload))
            })
        }
    }
}


