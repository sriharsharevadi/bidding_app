import userReducer from './userReducer'
import orderReducer from './orderReducer'
import errorReducer from './errorReducer'
import modalReducer from './modalReducer'
import bidReducer from './bidReducer'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    userReducer,
    orderReducer,
    errorReducer,
    modalReducer,
    bidReducer
})

export default rootReducer