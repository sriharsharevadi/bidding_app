import React from 'react'
import {Modal} from 'react-bootstrap'
import { Button } from "react-bootstrap"
import {connect} from 'react-redux'
import BootstrapTable from "react-bootstrap-table-next"

import {hideModal} from '../redux/actions/modalActions'
import {createBid} from '../redux/actions/bidActions'
import {fetchOrderDetails} from '../redux/actions/orderActions'
import client from '../graphql/graphql'
import {ALL_ORDERS_SUB} from '../graphql/subscriptions'


class ModalComponent extends React.Component {
  state = {
    price: "",
    orderId: ""
  }

  constructor() {
    super();

    this.state = {
      // For displaying data
      columns: [
        {
          dataField: "id",
          text: "Bid id",
          sort: true
        },
        {
          dataField: "price",
          text: "Price",
          sort: true
        },
        {
          dataField: "user.username",
          text: "Dealer Name"
        },
        {
            dataField: "user.email",
            text: "Dealer Email"
          },
      ],
    };
  }

  componentDidMount(){

    this.props.fetchOrderDetails(this.props.modal.modalPropsid, false);

    this.subscription = client.subscribe({
      query: ALL_ORDERS_SUB,
      variables:{
        model: "bids"
      }
    })
    .subscribe(res => {
      console.log(res.data)
      if (res.data.refresh.model === "bids"){
        this.props.fetchOrderDetails(this.props.modal.modalPropsid, false)
      }
    })
  }

  componentWillUnmount(){
    this.subscription.unsubscribe()
  }

  onFollowChanged() {
    this.props.hideModal();
  }

  handleOnChange = (e) => {
    e.persist();
    this.setState(() => ({
      [e.target.name]: e.target.value ,
      orderId: this.props.modal.modalPropsid
    }))
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.createBid(this.state)
  }

  render(){
    const { order, bid} = this.props 
    // console.log(bid.bids)

    return (
      <Modal        
        show = {true}
        // size="lg-2"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton
          onClick={() => {
            this.onFollowChanged();
            }
          }
          >
          <Modal.Title id="contained-modal-title-hcenter" className="centered-text">
            Place your bid
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="centered-text">
            Order Details #{order.id}
          </h4>
          <div className="container">
            <div className="row">
              <div className="col border rounded"><strong>Username:</strong> { order.user && order.user.username}</div>
              <div className="col border rounded" ><strong>Email:</strong> { order.user && order.user.email}</div>
              <div className="w-100"></div>
              <div className="col border rounded"><strong>Product Type:</strong> {order.type}</div>
              <div className="col border rounded"><strong>Quantity:</strong> {order.quantity}</div>
            </div>
          </div>
          {
            bid.bids &&
            <div>
              <h4 className="centered-text">Current Bids List</h4>
              <BootstrapTable
                  keyField="id"
                  data={bid.bids}
                  columns={this.state.columns}
                />
            </div>
          }            
          {
            !bid.price &&  
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <h4 className="centered-text">Your Bid Price</h4>
                <div className="col-xs-2">
                  <input 
                      type="number" 
                      name="price" 
                      placeholder="Price" 
                      value={this.state.price}
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
              </div>
            </form>
          }
          <div>
            {this.props.errors}
          </div>
          {
            bid.price && 
            <div className="alert alert-success m-0">
              Bid Successfully Placed
            </div>           }
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
    modal: state.modalReducer,
    bid: state.bidReducer,
    order: state.orderReducer.orderDetails,
    errors: state.errorReducer.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => dispatch(hideModal()),
    createBid: (bidInfo) => dispatch(createBid(bidInfo)),
    fetchOrderDetails: (id, req) => dispatch(fetchOrderDetails(id, req)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponent)