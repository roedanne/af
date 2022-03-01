import React, { Component} from "react";

import logo from './logo.svg';
import styles from './App.css';

import axios from 'axios';

// Quick implementation of an interface for demo purposes
class ProductsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
			products : [],
    }
    this.refreshComponentEvent = this.refreshComponent.bind(this);
  }

  componentDidMount() {
    this.refreshComponent();
  }

  refreshComponent() {
    console.log('refreshComponent()');
    let products = [];
    axios.get('api/products')
      .then(res => {
          res.data.map(i => {
               console.log('refreshComponent() # product', i);
               products.push(i);
          })
          this.setState({ products : products });
      })
      .catch(e => {
        console.log('refreshComponent() # Error in REST call', e);
      });
  }

  render () {
    if (this.state.products.length == 0) {
      return (<div className='App'>
                <div className='Main'>
                  <div className='grid-row'>
                    <div className='product'>
                      <div className='productOutOfStock'>
                        <div>Please upload data</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)
    }

  	return (
      <div className='App'>
        <div className='Main'>
          <div className='grid-row'>
          {
            this.state.products.map(p => (
              <Product data={p} refreshHandler={this.refreshComponentEvent} />
            ))
          }
          </div>
        </div>
      </div>
    );
  }
}

class Product extends Component {
	constructor(props) {
		super(props);
    this.state = {
      quantity : 0,
    }

    this.buyProductEvent = this.buyProductEvent.bind(this);

  }

	fail(e) {
		this.setState({isError: true});
	}

	componentDidMount() {
    this.updateStockQuantity();
	}

  updateStockQuantity() {
    console.log('updateStockQuantity()');
    axios.get('api/products/' + this.props.data.prod_id + '/quantity')
      .then(res => {
          console.log('updateStockQuantity() # Got quanity ' + res.data);
          this.setState({ quantity : res.data });
      })
      .catch(e => {
        console.log('updateStockQuantity() # Error in REST call', e);
      });
  }

  buyProductEvent() {
    axios.delete('api/products/' + this.props.data.prod_id)
      .then(res => {
          window.location.reload();
      })
      .catch(e => {
        console.log('buyProductEvent() # Error in REST call', e);
      });
  }

	render() {
    console.log('Product.render()', this.props.data);
    if (this.state.quantity == 0) {
      return (
        <div className='product'>
          <div className='productHeader'>{this.props.data.name}</div>
          <img className='productImage' src={`./${this.props.data.prod_id}.png`}/>
          <div className='price'>€ {this.props.data.price}</div>
          <div className='productOutOfStock'>
            <div>OUT OF STOCK</div>
          </div>
        </div>
      );
    }

    return (
			<div className='product'>
        <div className='productHeader'>{this.props.data.name}</div>
        <img className='productImage' src={`./${this.props.data.prod_id}.png`}/>
        <div className='price'>€ {this.props.data.price}</div>
        <div className='quantity'>{this.state.quantity} in stock</div>
        <button className='buyButton' onClick={this.buyProductEvent}>Buy</button>
      </div>
		);
	}
}

export default ProductsScreen;
