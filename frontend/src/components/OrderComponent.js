import React from 'react'
import {connect} from 'react-redux'
import { Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import BidModal from './bidModal'



import {fetchOrders, refreshOrders} from '../redux/actions/orderActions'
import {logUserOut} from '../redux/actions/userActions'
import {fetchModals, showModal} from '../redux/actions/modalActions'
 

class OrderComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      // For displaying data
      columns: [
        {
          dataField: "id",
          text: "id",
          sort: true
        },
        {
          dataField: "type",
          text: "Product Type",
          sort: true
        },
        {
          dataField: "quantity",
          text: "quantity"
        },
        {
          dataField: "follow",
          text: "Follow",
          formatter: this.linkFollow,
          sort: true
        }
      ],
      isFollow: true
    };

    this.onFollowChanged.bind(this);
  }
  onFollowChanged(row) {
    this.setState({ isFollow: !this.state.isFollow });
    // this.props.showModal({modalType: "BID_MODAL", modalProps: {
    //   id: row.id
    // }})
    this.props.showModal(row);

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
    const {fetchOrders, refreshOrders} = this.props;
      fetchOrders()
      refreshOrders("orders")
    }

    // compomnentWillUnmount() {
    //   console.log('unmounted')
    //   this.socket.disconnect()
    // }
    onSubmit = (e) => {
      e.preventDefault()
      this.props.logUserOut()
  }
  render(){
    console.log(this.props.modal)
    // console.log(this.props.orderReducer)
    const {orders} = this.props
    return(
      <div>
      <div style={{ padding: "20px" }}>
        <h1 className="h2">Products</h1>
        <BootstrapTable
          keyField="id"
          data={orders}
          columns={this.state.columns}
        />
      </div>
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="submit"
            value="Logout"
          />
        </form>
      </div> 
      <BidModal
      />     
      </div>
        
    )
  }
}

const mapStateToProps = (state) => {
    return {
      orders: state.orderReducer.orders,
      modal: state.modalReducer
    }
  }

const mapDispatchToProps = (dispatch) => {
    return {
        fetchOrders: () => dispatch(fetchOrders()),
        refreshOrders: (model) => dispatch(refreshOrders(model)),
        logUserOut: () => dispatch(logUserOut()),
        showModal: (row) => dispatch(showModal(row))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderComponent)