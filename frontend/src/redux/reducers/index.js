import userReducer from './userReducer'
import orderReducer from './orderReducer'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    userReducer,
    orderReducer
})

export default rootReducer