import {SHOW_MODAL, HIDE_MODAL} from '../actionTypes'
export const showModal = (payload) => ({ type: SHOW_MODAL, payload})
export const hideModal = (payload) => ({ type: HIDE_MODAL, payload})
