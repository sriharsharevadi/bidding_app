import React from 'react'
import {Modal} from 'react-bootstrap'
import { Button } from "react-bootstrap"
import {connect} from 'react-redux'
import BootstrapTable from "react-bootstrap-table-next"
import ToolkitProvider from "react-bootstrap-table2-toolkit"
import paginationFactory from 'react-bootstrap-table2-paginator'

import {hideModal} from '../redux/actions/modalActions'
import {fetchOrderDetails} from '../redux/actions/orderActions';
import client from '../graphql/graphql'
import {ALL_ORDERS_SUB} from '../graphql/subscriptions'

const pagination = paginationFactory({
  page: 1,
  alwaysShowAllBtns: true,
  // showTotal: true,
  withFirstAndLast: false,
  sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
    <div className="dataTables_length" id="datatable-basic_length">
      <label>
        {
          <select
            name="datatable-basic_length"
            aria-controls="datatable-basic"
            className="form-control form-control-sm"
            onChange={e => onSizePerPageChange(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        }{" "}
      </label>
    </div>
  )
});


class BidsListModalComponent extends React.Component {
  state = {
    price: "",
    orderId: ""
  }

  linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Button
        onClick={() => {
          this.onFollowChanged(row);
        }}
      >
        Place Bid
      </Button>
    );
  };

  componentDidMount(){
    this.props.fetchOrderDetails(this.props.modal.modalPropsid, true);
    // this.subscription = this.props.refreshBids(this.props.modal.modalPropsid, true);
    this.subscription = client.subscribe({
      query: ALL_ORDERS_SUB,
      variables:{
          model: "bids"
      }
    })
    .subscribe(res => {
      console.log(res.data)
      if (res.data.refresh.model === "bids"){
        this.props.fetchOrderDetails(this.props.modal.modalPropsid, true)
      }
    })
  }

  componentWillUnmount(){
    this.subscription.unsubscribe()
    console.log("unsubscribe")
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
    const { order, bids } = this.props
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
            Bids List for Order {order.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col border rounded"><strong>Product:</strong> {order.type}</div>
              <div className="col border rounded" ><strong>Quantity:</strong> {order.quantity}</div>
            </div>
          </div>
          <>
            <ToolkitProvider
              data={bids}
              keyField="id"
              columns={[
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
              ]}
              search
              >
              {props => (
                <div className="py-4">
                  <BootstrapTable
                    {...props.baseProps}
                    bootstrap4={true}
                    pagination={ pagination }
                    bordered={false}
                  />
                </div>
              )}
            </ToolkitProvider>
          </>
            <div>
                {this.props.errors}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={() => {
                this.onFollowChanged();
                }}
            >  Close
            </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    modal: state.modalReducer,
    order: state.orderReducer.orderDetails,
    bids: state.bidReducer.bids,
    errors: state.errorReducer.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: () => dispatch(hideModal()),
    fetchOrderDetails: (id, req) => dispatch(fetchOrderDetails(id, req)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BidsListModalComponent)