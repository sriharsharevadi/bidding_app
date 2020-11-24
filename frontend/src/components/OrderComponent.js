import React from 'react'
import {connect} from 'react-redux'
import {fetchOrders, refreshOrders} from '../redux/actions/orderActions'
 

class OrderComponent extends React.Component {
    componentDidMount(){
        this.props.fetchOrders()
        this.props.refreshOrders()
        console.log(this.props)
      }
      compomnentWillUnmount() {
        console.log('unmounted')
        this.socket.disconnect()
      }



    render(){
        console.log(this.props.orderReducer)
        const orders = this.props.orderReducer.orders.map((order) => {
            return (
              <div>
                  <div>
                  id: { order.id}
                  </div>
                  <div>
                  quantity: { order.quantity}
                  </div>
              </div>
            );
          });
        return(
            <div>
                <h1>{orders}</h1>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      orderReducer: state.orderReducer
    }
  }

const mapDispatchToProps = (dispatch) => {
    return {
        fetchOrders: () => dispatch(fetchOrders()),
        refreshOrders: () => dispatch(refreshOrders())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderComponent)