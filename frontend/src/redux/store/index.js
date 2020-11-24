import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import reduxWebsocket from '@giantmachines/redux-websocket';


const store = createStore(rootReducer, applyMiddleware(thunk))

export default store