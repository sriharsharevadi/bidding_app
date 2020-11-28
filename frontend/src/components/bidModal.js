// import { Button } from "react-bootstrap"
// import {connect} from 'react-redux'


// export const bidModal = (props) => {
//   console.log(props)
//     return (
//       <div>hello</div>
//       // <Modal
//       //   {...props}
//       //   size="lg"
//       //   aria-labelledby="contained-modal-title-vcenter"
//       //   centered
//       // >
//       //   <Modal.Header closeButton>
//       //     <Modal.Title id="contained-modal-title-vcenter">
//       //       Modal heading
//       //     </Modal.Title>
//       //   </Modal.Header>
//       //   <Modal.Body>
//       //     <h4>Centered Modal</h4>
//       //     <p>
//       //       Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
//       //       dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
//       //       consectetur ac, vestibulum at eros.
//       //     </p>
//       //   </Modal.Body>
//       //   <Modal.Footer>
//       //     <Button onClick={props.onHide}>Close</Button>
//       //   </Modal.Footer>
//       // </Modal>
//     );
//   }
import React from 'react'
import {Modal} from 'react-bootstrap'
import { Button } from "react-bootstrap"
import {connect} from 'react-redux'
import {hideModal} from '../redux/actions/modalActions'




class ModalComponent extends React.Component {
  onFollowChanged() {
    // this.setState({ isFollow: !this.state.isFollow });
    // this.props.showModal({modalType: "BID_MODAL", modalProps: {
    //   id: row.id
    // }})
    this.props.hideModal();
    console.log("clicked")


  }
  render(){
    const {modal} = this.props 
    console.log(this.props.modal)
    if (!this.props.modal.modalType) {
      return <span /> // after React v15 you can return null here
    }
    return (

      <Modal        
        show = {true}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton
          onClick={() => {
            this.onFollowChanged();
            }
          }
        >
          <Modal.Title id="contained-modal-title-hcenter">
            Place your bid
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Centered Modal</h4>
          <p>
            {modal.modalPropsid}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {
          this.onFollowChanged();
        }}
          >Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    modal: state.modalReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => dispatch(hideModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponent)