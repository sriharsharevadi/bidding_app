import React from 'react'
import {connect} from 'react-redux'
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"

import {fetchBids} from '../redux/actions/bidActions'

const { SearchBar } = Search;


class MyBidComponent extends React.Component {

  componentDidMount(){
    const {fetchBids} = this.props;
    fetchBids()
  }

  render(){
    // console.log(modal)
    return(
      <div className="content">
        <div className="px-xl-5">
          <>
            <ToolkitProvider
              data={this.props.bids}
              keyField="id"
              columns={[
                {
                  dataField: "id",
                  text: "Bid ID",
                  sort: true
                },
                {
                  dataField: "order.id",
                  text: "Order ID",
                  sort: true
                },
                {
                  dataField: "order.type",
                  text: "Product",
                  sort: true
                },
                {
                  dataField: "order.quantity",
                  text: "Quantity"
                },
                {
                  dataField: "price",
                  text: "My Price",
                  sort: true
                },
                {
                  dataField: "accepted",
                  text: "Bid Status",
                  sort: true
                },
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
                        <p className="h3 centered-text">My Bids</p>
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
      </div>  
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bids: state.bidReducer.bids,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBids: () => dispatch(fetchBids()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBidComponent)