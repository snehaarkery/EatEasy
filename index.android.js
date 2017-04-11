import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Settings from './components/Settings';
import BarcodeScanner from './components/BarcodeScanner';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'SCANNER'
    };

    this.changePage = this.changePage.bind(this);
  }

  changePage(newPage) {
    this.setState({
      currentPage: newPage
    })
  }

  render() {
    if (this.state.currentPage === 'SETTINGS') {
      return (<Settings changePage={this.changePage} />);
    } else if (this.state.currentPage === 'SCANNER') {
      return (<BarcodeScanner changePage={this.changePage} />);
    }
  }
}

AppRegistry.registerComponent('EatEasy', () => App);