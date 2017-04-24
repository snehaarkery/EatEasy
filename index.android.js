import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Settings from './components/Settings';
import BarcodeScanner from './components/BarcodeScanner';
import ShoppingCart from './components/ShoppingCart';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'SCANNER',
      cart: []
    };

    this.changePage = this.changePage.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
  }

  changePage(newPage) {
    this.setState({
      currentPage: newPage
    });
  }

  addToCart(item) {
    this.setState({
      cart: [ ...this.state.cart, item ]
    });
  }

  removeFromCart(index) {
    this.setState({
      cart: [
        ...this.state.cart.slice(0, index),
        ...this.state.cart.slice(index + 1),
      ]
    });
  }

  render() {
    if (this.state.currentPage === 'SETTINGS') {
      return (<Settings changePage={this.changePage} />);
    } else if (this.state.currentPage === 'SCANNER') {
      return (
        <BarcodeScanner
          changePage={this.changePage}
          addToCart={this.addToCart}
        />
      );
    } else if (this.state.currentPage === 'CART') {
      return (
        <ShoppingCart
          changePage={this.changePage}
          cart={this.state.cart}
          removeFromCart={this.removeFromCart}
        />
      );
    }
  }
}

AppRegistry.registerComponent('EatEasy', () => App);