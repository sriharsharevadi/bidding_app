// These are regular React components we will write soon
import {bidModal} from './bidModal'
import {connect} from 'react-redux'


const MODAL_COMPONENTS = {
  'BID_MODAL': bidModal,
  /* other modals */
}

const ModalRoot = ({ modalType, modalProps }) => {
  console.log(modalType, modalProps)
  if (!modalType) {
    return <span /> // after React v15 you can return null here
  }

  const SpecificModal = MODAL_COMPONENTS[modalType]
  console.log(bidModal)
  return <SpecificModal {...modalProps} />
}

const mapStateToProps = (state) => {
    return {
      ee: state.modelReducer
    }
  }

export default connect(mapStateToProps)(ModalRoot)
