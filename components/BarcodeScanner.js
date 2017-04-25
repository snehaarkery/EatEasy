import React, { Component } from 'react';
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import axios from 'axios';
import Camera from 'react-native-camera';

class BarcodeScanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCamera: true,
      cameraType: Camera.constants.Type.back,
      barcodeData: {
        data: '',
        type: ''
      },
      productInfo: null,
      isWithinDiet: null
    }

    this._onBarCodeRead = this._onBarCodeRead.bind(this);
    this._renderAddToCartButton = this._renderAddToCartButton.bind(this);
    this._renderProductInfo = this._renderProductInfo.bind(this);
    this._renderWithinDiet = this._renderWithinDiet.bind(this);
  }

  _renderProductInfo() {
    if (this.state.productInfo === 404) {
      return <Text>Product not found!</Text>
    }

    if (!this.state.productInfo) {
      return (<Text>Getting ingredients...</Text>);
    }

    return Object.keys(this.state.productInfo.product.attributes)
      .map((key) => {
        return (
          <Text key={key}>{key}: {this.state.productInfo.product.attributes[key]}</Text>
        );
      });
  }

  _renderWithinDiet() {
    if (this.state.isWithinDiet === null) {
      return (<Text>Checking if this item is within your diet...</Text>);
    }

    if (this.state.isWithinDiet) {
      return (<Text>This item is within your diet!</Text>);
    } else {
      return (<Text>This item is NOT within your diet.</Text>);
    }
  }

  _renderAddToCartButton() {
    if (this.state.productInfo) {
      return (
        <Button
          onPress={() => this.props.addToCart(this.state.productInfo)}
          title="Add to Cart"
          color="#aaaaaa"
          accessibilityLabel="press this to add the scanned item to your cart"
        />
      );
    } else {
      return null;
    }
  }

  render() {
    if (this.state.showCamera) {
      return (
        <Camera
          ref="cam"
          onBarCodeRead={this._onBarCodeRead}
          style={styles.container}
          type={this.state.cameraType}
        >
          <Button
            onPress={() => this.props.changePage('SETTINGS')}
            title="Return to Settings"
            color="#21a73b"
            accessibilityLabel="press this to set your dietary restrictions"
          />
          <Button
            onPress={() => this.props.changePage('CART')}
            title="Go to Cart"
            color="#219fa7"
            accessibilityLabel="press this to go to your shopping cart"
          />
        </Camera>
      );
    } else {
      return (
        <ScrollView>
          <Button
            onPress={() => this.setState({ showCamera: true })}
            title="Return to Scanner"
            color="#21a73b"
            accessibilityLabel="press this to return to the camera"
          />
          <Text>Type: {this.state.barcodeData.type}</Text>
          <Text>Data: {this.state.barcodeData.data}</Text>
          {this._renderWithinDiet()}
          {this._renderProductInfo()}
          {this._renderAddToCartButton()}
        </ScrollView>
      );
    }
  }

  _onBarCodeRead(d) {
    const api = 'http://eandata.com/feed/?v=3&keycode=DF7419BC58E1ED96&mode=json&find='

    axios.get(api + d.data).then((res) => {
      console.log(res);
      if (+res.data.status.code === 404) {
        this.setState({
          productInfo: 404
        });
      } else {
        this.setState({
          productInfo: res.data
        });

        if (this.props.saved[2] && JSON.stringify(res.data).includes('peanut')) {
          this.setState({
            isWithinDiet: false
          });
        } else {
          this.setState({
            isWithinDiet: true
          });
        }
      }
    });

    this.setState({
      showCamera: false,
      barcodeData: d,
      productInfo: null,
      isWithinDiet: null
    });
    console.log(d);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  }
});

export default BarcodeScanner;