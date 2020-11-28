import {SHOW_MODAL, HIDE_MODAL} from '../actionTypes'
import { rewriteURIForGET } from '@apollo/client'
export const showModal = (payload) => ({ type: SHOW_MODAL, payload})
export const hideModal = (payload) => ({ type: HIDE_MODAL, payload})
