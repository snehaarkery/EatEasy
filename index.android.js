import React, { Component } from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import Settings from './components/Settings';
import BarcodeScanner from './components/BarcodeScanner';
import ShoppingCart from './components/ShoppingCart';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'SCANNER',
      cart: [],
      settings: [ false, false, false, false, false, false ]
    };

    this.changePage = this.changePage.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.changeSettings = this.changeSettings.bind(this);
  }

  componentWillMount() {
    AsyncStorage.getItem('savedSettings').then((value) => {
      this.setState({ settings: (value || '').split(',').map((val) => (val === 'true')) });
    }).done();
  }

  changeSettings(checked, i) {
    this.setState({
      settings: [
        ...this.state.settings.slice(0, i),
        checked,
        ...this.state.settings.slice(i + 1)
      ]
    });
    AsyncStorage.setItem('savedSettings', [
      ...this.state.settings.slice(0, i),
      checked,
      ...this.state.settings.slice(i + 1)
    ].toString())
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
      return (
        <Settings
          changePage={this.changePage}
          changeSettings={this.changeSettings}
          saved={this.state.settings}
        />
      );
    } else if (this.state.currentPage === 'SCANNER') {
      return (
        <BarcodeScanner
          changePage={this.changePage}
          addToCart={this.addToCart}
          saved={this.state.settings}
        />
      );
    } else if (this.state.currentPage === 'CART') {
      return (
        <ShoppingCart
          changePage={this.changePage}
          cart={this.state.cart}
          removeFromCart={this.removeFromCart}
          saved={this.state.settings}
        />
      );
    }
  }
}

AppRegistry.registerComponent('EatEasy', () => App);