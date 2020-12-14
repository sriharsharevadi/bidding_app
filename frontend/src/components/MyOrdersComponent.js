import React from 'react'
import {connect} from 'react-redux'
import BootstrapTable from "react-bootstrap-table-next"
import BidsListModalComponent from './BidsListModal'
import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"

import {fetchOrders} from '../redux/actions/orderActions'
import {logUserOut} from '../redux/actions/userActions'
import {showModal} from '../redux/actions/modalActions'
import {MY_ORDERS_QUERY} from '../graphql/queries'
import client from '../graphql/graphql'
import {ALL_ORDERS_SUB} from '../graphql/subscriptions'

const { SearchBar } = Search;


class MyOrderComponent extends React.Component {

  onFollowChanged(row) {
    this.props.showModal(row);
  }

  linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <button type="button"
        className="btn btn-primary"
        onClick={() => {
          this.onFollowChanged(row);
        }}
      >
        View Bids
      </button>
    );
  }

  componentDidMount(){
    const {fetchOrders} = this.props
    fetchOrders(MY_ORDERS_QUERY)
    this.subscription = client.subscribe({
      query: ALL_ORDERS_SUB,
      variables:{
          model: "orders"
      }
    })
    .subscribe(res => {
      // console.log(res.data)
      if (res.data.refresh.model === "orders"){
        fetchOrders(MY_ORDERS_QUERY)
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
    // console.log(this.props.modal.modalType != null)
    const {myOrders, modal} = this.props

    return(
      <div className="content">
        <div className="px-xl-5">
          <>
            <ToolkitProvider
              data={myOrders}
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
                  dataField: "createdAt",
                  text: "Created At"
                },
                {
                  dataField: "follow",
                  text: "View Bids",
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
                        <p className="h3 centered-text">My Orders</p>
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
                    striped
                    wrapperClasses="table-responsive"
                  />
                </div>
              )}
            </ToolkitProvider>
          </>
        </div>
        { (modal.modalType === "OrdType") &&
        <BidsListModalComponent />
        } 
        {/* { (modal.modalType === "CreateOrder") &&
        <OrderCreateComponent />
        }             */}
      </div>  
    )
  }
}

const mapStateToProps = (state) => {
  return {
    myOrders: state.orderReducer.myOrders,
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

export default connect(mapStateToProps, mapDispatchToProps)(MyOrderComponent)