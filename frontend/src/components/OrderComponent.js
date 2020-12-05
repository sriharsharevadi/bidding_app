import React from 'react'
import {connect} from 'react-redux'
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"

import {fetchOrders} from '../redux/actions/orderActions'
import {logUserOut} from '../redux/actions/userActions'
import {showModal} from '../redux/actions/modalActions'
import BidModal from './bidModal'
import {AVAILABLE_ORDERS_QUERY} from '../graphql/queries'
import client from '../graphql/graphql'
import {ALL_ORDERS_SUB} from '../graphql/subscriptions'

const { SearchBar } = Search;


class OrderComponent extends React.Component {

  onFollowChanged(row) {
     this.props.showModal(row);
  }

  linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <button type="button"
        className="btn btn-info"
        onClick={() => {
          this.onFollowChanged(row);
        }}
      >
        Place Bid
      </button>
    );
  };

  componentDidMount(){
    const {fetchOrders} = this.props;
    fetchOrders(AVAILABLE_ORDERS_QUERY)
    this.subscription = client.subscribe({
      query: ALL_ORDERS_SUB,
      variables:{
          model: "orders"
      }
    })
    .subscribe(res => {
      // console.log(res.data)
      if (res.data.refresh.model === "orders"){
        fetchOrders(AVAILABLE_ORDERS_QUERY)
      }
    })
  }
  
  componentWillUnmount(){
    this.subscription.unsubscribe()
    // console.log("unsubscribe")
  }


  onSubmit = (e) => {
    e.preventDefault()
    this.props.logUserOut()
  }

  onCreateOrder = (e) => {
    e.preventDefault()
    this.props.showModal({'__typename': 'CreateOrder'});
  }

  render(){
    const {orders, modal} = this.props
    // console.log(modal)
    return(
      <div className="content">
        <div className="px-xl-5">
          <>
            <ToolkitProvider
              data={orders}
              keyField="id"
              columns={[
                {
                  dataField: "id",
                  text: "Order ID",
                  sort: true
                },
                {
                  dataField: "type",
                  text: "Product",
                  sort: true
                },
                {
                  dataField: "quantity",
                  text: "Quantity"
                },
                {
                  dataField: "user.username",
                  text: "Customer Name",
                  sort: true
                },
                {
                  dataField: "user.email",
                  text: "Customer Email"
                },
                {
                  dataField: "follow",
                  text: "Place Bid",
                  formatter: this.linkFollow,
                  sort: true
                }
              ]}
              search
              >
              {props => (
                <div className="py-4">
                  <div
                    id="datatable-basic_filter"
                    className="dataTables_filter px-4 pb-1"
                  >
                    <div className="row">
                      <div className="col centered-text vertical-center">
                        <p className="h3 centered-text">Available Orders</p>
                      </div>
                      <div className="col-4">
                        <label className="centered-text">
                          Search:
                          <SearchBar
                            className="form-control-sm"
                            placeholder=""
                            {...props.searchProps}
                          />
                        </label>
                      </div>                        
                    </div>       
                  </div>
                  <BootstrapTable
                    {...props.baseProps}
                    bootstrap4={true}
                    pagination={ paginationFactory() }
                    bordered={false}
                  />
                </div>
              )}
            </ToolkitProvider>
          </>
        </div>
      { (modal.modalType === "OrdType") &&
       <BidModal />
      }          
      </div>   
    )
  }
}

const mapStateToProps = (state) => {
    return {
      orders: state.orderReducer.orders,
      modal: state.modalReducer,
    }
  }

const mapDispatchToProps = (dispatch) => {
    return {
        fetchOrders: (query) => dispatch(fetchOrders(query)),
        logUserOut: () => dispatch(logUserOut()),
        showModal: (row) => dispatch(showModal(row)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderComponent)