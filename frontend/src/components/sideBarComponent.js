import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';

import OrderCreateComponent from './orderModal'
import {logUserOut} from '../redux/actions/userActions'
import {showModal} from '../redux/actions/modalActions'


class SideBarComponent extends React.Component {
    state = {
        username: "",
        password: ""
    }
    onLogUserOut = (e) => {
        e.preventDefault()
        this.props.logUserOut()
      }
    onCreateOrder = (e) => {
    e.preventDefault()
    this.props.showModal({'__typename': 'CreateOrder'});
    }

    render(){
        const { location } = this.props;
        const ordersClass = location.pathname === "/" ? "active" : "";
        const myOrdersClass = location.pathname.match(/^\/myorders/) ? "active" : "";
        const myBidsClass = location.pathname.match(/^\/mybids/) ? "active" : "";

        return(
            <div>
                <div className="sidebar">
                    <div class="row">
                        <div class="col-4 centered-text">
                            <img src="/bidding.png" alt= "bidding icon" width="50" height="50" />
                        </div>
                        <div class="col">
                            <p className= "h4">Welcome </p>
                            <p className= "h5"><strong>{this.props.username.toUpperCase()}</strong> </p>
                        </div>                        
                    </div>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        <Link to="/" className={ordersClass}><li className={ordersClass}><strong>AVAILABLE ORDERS</strong></li></Link>
                        <Link to="/myorders" ><li className={myOrdersClass}><strong>MY ORDERS</strong></li></Link>
                        <Link to="/mybids"><li className={myBidsClass}><strong>MY BIDS</strong></li></Link>
                    </ul>
                </div>
                <div className="content">
                    <nav className="navbar navbar-dark">
                        <form className="form-inline ml-auto ">
                            <button
                                className="btn btn-success ml-5 " 
                                type="submit"
                                onClick={this.onCreateOrder}
                             >
                                Create New Order
                            </button>                        
                            <button 
                                className="btn btn-danger ml-5" 
                                type="submit"
                                onClick={this.onLogUserOut}
                                >Log Out
                            </button>
                        </form>
                    </nav>
                </div>
                { (this.props.modal.modalType === "CreateOrder") &&
       <OrderCreateComponent />
      }
            </div>       
        )
    }
}

const mapStateToProps = (state) => {
    return {
        modal: state.modalReducer,
        username: state.userReducer.user.username
    }
  }

const mapDispatchToProps = (dispatch) => {
    return {
        logUserOut: () => dispatch(logUserOut()),
        showModal: (row) => dispatch(showModal(row)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarComponent)