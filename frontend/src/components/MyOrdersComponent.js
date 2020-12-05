import React from 'react'
import {connect} from 'react-redux'
import BootstrapTable from "react-bootstrap-table-next";
import BidsListModalComponent from './BidsListModal'
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";


import {fetchOrders, refreshOrders} from '../redux/actions/orderActions'
import {logUserOut} from '../redux/actions/userActions'
import {showModal} from '../redux/actions/modalActions'
import {MY_ORDERS_QUERY} from '../graphql/queries'

const { SearchBar } = Search;

class MyOrderComponent extends React.Component {

  onFollowChanged(row) {
    this.props.showModal(row);
  }

  linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <button type="button"
        class="btn btn-primary"
        onClick={() => {
          this.onFollowChanged(row);
        }}
      >
        View Bids
      </button>
    );
  }

  componentDidMount(){
    const {fetchOrders, refreshOrders} = this.props;
      fetchOrders(MY_ORDERS_QUERY)
      refreshOrders("orders", MY_ORDERS_QUERY)
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
                    <div class="row">
                      <div class="col centered-text vertical-center">
                        <p className="h3 centered-text">My Orders</p>
                      </div>
                      <div class="col-4">
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
    refreshOrders: (model, query) => dispatch(refreshOrders(model,query)),
    logUserOut: () => dispatch(logUserOut()),
    showModal: (row) => dispatch(showModal(row)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyOrderComponent)