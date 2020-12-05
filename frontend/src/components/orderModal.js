import React from 'react'
import {Modal} from 'react-bootstrap'
import { Button } from "react-bootstrap"
import {connect} from 'react-redux'

import {hideModal} from '../redux/actions/modalActions'
import {createOrder} from '../redux/actions/orderActions'


class OrderCreateComponent extends React.Component {
  state = {
    type: "a",
    quantity: ""
  }

  onFollowChanged() {
    this.props.hideModal();
  }
 
  handleOnChange = (e) => {
    e.persist();
    this.setState(() => ({
      [e.target.name]: e.target.value ,
    }))
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.createOrder(this.state)
  }

  render(){
    const { order} = this.props 
    return (
      <Modal        
        show = {true}
        size="lg-3"
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
            Place your order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          { !order &&
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label>Product Type</label>
                <select 
                  className="form-control" 
                  name="type"
                  value={this.state.type}
                  onChange={this.handleOnChange}>
                  <option value="a" >Type A</option>
                  <option value="b" >Type B</option>
                  <option value="c" >Type C</option>
                </select>
              </div>
              <div className="form-group col-xs-2">
                <label>Quantity</label>
                <input 
                  type="number" 
                  required={true}
                  name="quantity" 
                  placeholder="Quantity" 
                  value={this.state.quantity}
                  onChange={this.handleOnChange}
                  className="form-control"
                />
              </div>

              <div className="span12 centered-text">
                  <button 
                    className="btn btn-success " 
                    type="submit"
                    value="Login"
                    >
                    Submit
                  </button> 
                </div>
           </form>
          }
          <div>
            {this.props.errors}
          </div>
          {
            order &&
            <div className="alert alert-success m-0">
              Order Successfully Placed
            </div> 
          }
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
    order: state.orderReducer.order_create.order,
    errors: state.errorReducer.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => dispatch(hideModal()),
    createOrder: (orderInfo) => dispatch(createOrder(orderInfo)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderCreateComponent)