import React from 'react'
import {connect} from 'react-redux'
import {fetchOrders, refreshOrders} from '../redux/actions/orderActions'
import {logUserOut} from '../redux/actions/userActions'
 

class OrderComponent extends React.Component {
    componentDidMount(){
      const {fetchOrders, refreshOrders} = this.props;
        fetchOrders()
        console.log('Mounted')
        refreshOrders()
        // console.log(this.props)
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
        // console.log(this.props.orderReducer)
        const {orders} = this.props
        var orderList = <div>No orders</div>
        if (orders){
          orderList = orders.map((order) => {
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
        }       
        return(
            <div>
                <h1>{orderList}</h1>
                <form onSubmit={this.onSubmit}>
                    <input
                        type="submit"
                        value="Logout"
                    />
                </form>
            </div>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
      orders: state.orderReducer.orders
    }
  }

const mapDispatchToProps = (dispatch) => {
    return {
        fetchOrders: () => dispatch(fetchOrders()),
        refreshOrders: () => dispatch(refreshOrders()),
        logUserOut: () => dispatch(logUserOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderComponent)